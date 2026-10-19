import { NextResponse } from "next/server";

import {
  createSlotRow,
  initializeDatabase,
  listSlotRows,
} from "../../db/postgres";

export async function GET(): Promise<NextResponse> {
  try {
    await initializeDatabase();
    const slots = await listSlotRows();

    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Database connection unavailable.",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await initializeDatabase();

    const body = (await request.json()) as { capacity?: number };
    const capacity = Number(body.capacity);

    if (!Number.isInteger(capacity) || capacity <= 0) {
      return NextResponse.json(
        { error: "Slot capacity must be a positive integer" },
        { status: 400 },
      );
    }

    const slot = await createSlotRow(capacity);
    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Database connection unavailable.",
      },
      { status: 503 },
    );
  }
}
