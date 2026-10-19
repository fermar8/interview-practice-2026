import { Client } from "pg";

import {
  closeDatabasePool,
  createReservationRow,
  createSlotRow,
  initializeDatabase,
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

  it("should keep duplicate slot creation idempotent at the SQL layer", async () => {
    const first = await createSlotRow(12);
    const second = await createSlotRow(12);

    expect(first).toEqual(second);
    expect(first.capacity).toBe(12);
    expect(first.reserved).toBe(0);
  });

  it("should prevent the final seat from being double-booked inside a transaction", async () => {
    const slot = await createSlotRow(1);
    const first = await createReservationRow(slot.id, "user-1");

    await expect(createReservationRow(slot.id, "user-2")).rejects.toThrow(
      "Slot is full",
    );
    expect(first.userId).toBe("user-1");
  });
});
