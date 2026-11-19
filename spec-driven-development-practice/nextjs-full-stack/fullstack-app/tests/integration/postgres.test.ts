import { Client } from "pg";

import {
  cancelReservationRow,
  closeDatabasePool,
  createReservationRow,
  createSlotRow,
  initializeDatabase,
  listReservationRows,
  listSlotRows,
} from "../../app/db/postgres";

describe("postgres reservation repository", () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  beforeEach(async () => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(
      "TRUNCATE TABLE reservations, slots RESTART IDENTITY CASCADE",
    );
    await client.end();
  });

  afterAll(async () => {
    await closeDatabasePool();
  });

  it("should create distinct slots when the same capacity is submitted twice", async () => {
    const first = await createSlotRow(12);
    const second = await createSlotRow(12);

    expect(first.id).toBe("slot-1");
    expect(second.id).toBe("slot-2");
    expect(first.capacity).toBe(12);
    expect(second.capacity).toBe(12);
    expect(first.reserved).toBe(0);
    expect(second.reserved).toBe(0);
  });

  it("should prevent the final seat from being double-booked inside a transaction", async () => {
    const slot = await createSlotRow(1);
    const first = await createReservationRow(slot.id, "user-1");

    await expect(createReservationRow(slot.id, "user-2")).rejects.toThrow(
      "Slot is full",
    );
    expect(first.userId).toBe("user-1");
  });

  it("should cancel a reservation and release capacity exactly once", async () => {
    const slot = await createSlotRow(2);
    const reservation = await createReservationRow(slot.id, "user-1");

    await cancelReservationRow(reservation.id);

    const slots = await listSlotRows();
    const updatedSlot = slots.find((entry) => entry.id === slot.id);
    expect(updatedSlot?.reserved).toBe(0);

    const reservations = await listReservationRows();
    expect(reservations.find((entry) => entry.id === reservation.id)).toBe(
      undefined,
    );
  });

  it("should reject repeated cancellation for the same reservation", async () => {
    const slot = await createSlotRow(2);
    const reservation = await createReservationRow(slot.id, "user-1");

    await cancelReservationRow(reservation.id);
    await expect(cancelReservationRow(reservation.id)).rejects.toThrow(
      "Reservation not found",
    );

    const slots = await listSlotRows();
    const updatedSlot = slots.find((entry) => entry.id === slot.id);
    expect(updatedSlot?.reserved).toBe(0);
  });

  it("should reject cancellation for a non-existent reservation", async () => {
    await expect(cancelReservationRow("reservation-404")).rejects.toThrow(
      "Reservation not found",
    );
  });

  it("should prevent concurrent cancellation from decrementing capacity twice", async () => {
    const slot = await createSlotRow(2);
    const reservation = await createReservationRow(slot.id, "user-1");

    const [first, second] = await Promise.allSettled([
      cancelReservationRow(reservation.id),
      cancelReservationRow(reservation.id),
    ]);

    const outcomes = [first.status, second.status];
    expect(outcomes.filter((status) => status === "fulfilled")).toHaveLength(1);
    expect(outcomes.filter((status) => status === "rejected")).toHaveLength(1);

    const slots = await listSlotRows();
    const updatedSlot = slots.find((entry) => entry.id === slot.id);
    expect(updatedSlot?.reserved).toBe(0);

    const reservations = await listReservationRows();
    expect(reservations.find((entry) => entry.id === reservation.id)).toBe(
      undefined,
    );

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const cancelledRows = await client.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM reservations WHERE id = $1 AND cancelled_at IS NOT NULL",
      [reservation.id],
    );
    await client.end();

    expect(Number(cancelledRows.rows[0]?.count ?? "0")).toBe(1);
  });
});
