import { Pool, PoolClient } from "pg";
import type { Reservation, Slot } from "../model/types";

type SlotRow = {
  id: string;
  capacity: number;
  reserved: number;
};

type ReservationRow = {
  id: string;
  slot_id: string;
  user_id: string;
  created_at: string;
  cancelled_at: string | null;
};

let databasePool: Pool | undefined;
let schemaIsReady = false;

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Database connection unavailable: DATABASE_URL is not configured.",
    );
  }

  if (!databasePool) {
    databasePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
    });
  }

  if (!databasePool) {
    throw new Error("Database pool is not initialized");
  }

  return databasePool;
}

export async function initializeDatabase(): Promise<void> {
  if (!process.env.DATABASE_URL || schemaIsReady) {
    return;
  }

  const client = await getPool().connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id TEXT PRIMARY KEY,
        capacity INTEGER NOT NULL CHECK (capacity > 0),
        reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0)
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        slot_id TEXT NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        cancelled_at TIMESTAMPTZ NULL
      );
    `);

    await client.query(`
      ALTER TABLE reservations
      ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ NULL;
    `);

    await client.query(`
      DROP INDEX IF EXISTS reservation_slot_user_unique_idx;
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS reservation_active_slot_user_unique_idx
      ON reservations (slot_id, user_id)
      WHERE cancelled_at IS NULL;
    `);

    schemaIsReady = true;
  } finally {
    client.release();
  }
}

function mapSlot(row: SlotRow): Slot {
  return {
    id: row.id,
    capacity: Number(row.capacity),
    reserved: Number(row.reserved),
  };
}

function mapReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    slotId: row.slot_id,
    userId: row.user_id,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function getNextSequentialId(
  client: PoolClient,
  prefix: "slot" | "reservation",
  tableName: "slots" | "reservations",
): Promise<string> {
  const result = await client.query<{ next_id: string }>(
    `SELECT COALESCE(MAX(CAST(REPLACE(id, $1, '') AS INTEGER)), 0) + 1 AS next_id FROM ${tableName}`,
    [`${prefix}-`],
  );

  const nextId = Number(result.rows[0]?.next_id ?? 1);
  return `${prefix}-${nextId}`;
}

export async function createSlotRow(capacity: number): Promise<Slot> {
  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw new Error("Slot capacity must be a positive integer");
  }

  await initializeDatabase();

  const client = await getPool().connect();

  try {
    const slotId = await getNextSequentialId(client, "slot", "slots");
    const inserted = await client.query<SlotRow>(
      "INSERT INTO slots (id, capacity, reserved) VALUES ($1, $2, 0) RETURNING id, capacity, reserved",
      [slotId, capacity],
    );

    return mapSlot(inserted.rows[0]);
  } finally {
    client.release();
  }
}

export async function listSlotRows(): Promise<Slot[]> {
  await initializeDatabase();

  const result = await getPool().query<SlotRow>(
    "SELECT id, capacity, reserved FROM slots ORDER BY id ASC",
  );

  return result.rows.map(mapSlot);
}

export async function listReservationRows(): Promise<Reservation[]> {
  await initializeDatabase();

  const result = await getPool().query<ReservationRow>(
    "SELECT id, slot_id, user_id, created_at, cancelled_at FROM reservations WHERE cancelled_at IS NULL ORDER BY created_at DESC",
  );

  return result.rows.map(mapReservation);
}

export async function createReservationRow(
  slotId: string,
  userId: string,
): Promise<Reservation> {
  if (!slotId.trim()) {
    throw new Error("Slot ID is required");
  }

  if (!userId.trim()) {
    throw new Error("User ID is required");
  }

  await initializeDatabase();

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const duplicate = await client.query<ReservationRow>(
      "SELECT id, slot_id, user_id, created_at, cancelled_at FROM reservations WHERE slot_id = $1 AND user_id = $2 AND cancelled_at IS NULL LIMIT 1",
      [slotId, userId],
    );

    if (duplicate.rowCount && duplicate.rows[0]) {
      await client.query("COMMIT");
      return mapReservation(duplicate.rows[0]);
    }

    const slot = await client.query<SlotRow>(
      "SELECT id, capacity, reserved FROM slots WHERE id = $1 FOR UPDATE",
      [slotId],
    );

    if (!slot.rowCount || !slot.rows[0]) {
      throw new Error("Slot not found");
    }

    const currentSlot = slot.rows[0];
    if (Number(currentSlot.reserved) >= Number(currentSlot.capacity)) {
      throw new Error("Slot is full");
    }

    const reservationId = await getNextSequentialId(
      client,
      "reservation",
      "reservations",
    );
    const inserted = await client.query<ReservationRow>(
      `INSERT INTO reservations (id, slot_id, user_id, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, slot_id, user_id, created_at, cancelled_at`,
      [reservationId, slotId, userId],
    );

    await client.query(
      "UPDATE slots SET reserved = reserved + 1 WHERE id = $1",
      [slotId],
    );

    await client.query("COMMIT");

    return mapReservation(inserted.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getReservationRow(
  id: string,
): Promise<Reservation | undefined> {
  await initializeDatabase();

  const result = await getPool().query<ReservationRow>(
    "SELECT id, slot_id, user_id, created_at, cancelled_at FROM reservations WHERE id = $1 AND cancelled_at IS NULL",
    [id],
  );

  return result.rowCount ? mapReservation(result.rows[0]) : undefined;
}

export async function cancelReservationRow(id: string): Promise<void> {
  await initializeDatabase();

  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const result = await client.query<{ slot_id: string }>(
      `UPDATE reservations
       SET cancelled_at = NOW()
       WHERE id = $1 AND cancelled_at IS NULL
       RETURNING slot_id`,
      [id],
    );

    if (!result.rowCount || !result.rows[0]) {
      throw new Error("Reservation not found");
    }

    await client.query(
      "UPDATE slots SET reserved = GREATEST(0, reserved - 1) WHERE id = $1",
      [result.rows[0].slot_id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function closeDatabasePool(): Promise<void> {
  if (databasePool) {
    await databasePool.end();
    databasePool = undefined;
    schemaIsReady = false;
  }
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
