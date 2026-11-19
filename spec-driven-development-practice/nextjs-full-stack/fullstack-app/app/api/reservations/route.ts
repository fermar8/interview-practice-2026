import { NextResponse } from "next/server";

import {
  cancelReservationRow,
  createReservationRow,
  initializeDatabase,
  listReservationRows,
} from "../../db/postgres";

export async function GET(): Promise<NextResponse> {
  try {
    await initializeDatabase();
    const reservations = await listReservationRows();

    return NextResponse.json(reservations);
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

    const body = (await request.json()) as {
      slotId?: string;
      userId?: string;
    };

    if (!body.slotId?.trim() || !body.userId?.trim()) {
      return NextResponse.json(
        { error: "Slot ID and user ID are required" },
        { status: 400 },
      );
    }

    const reservation = await createReservationRow(body.slotId, body.userId);
    return NextResponse.json(reservation, { status: 201 });
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

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    await initializeDatabase();

    const url = new URL(request.url);
    const reservationId = url.searchParams.get("id");

    if (!reservationId) {
      return NextResponse.json(
        { error: "Reservation ID is required" },
        { status: 400 },
      );
    }

    await cancelReservationRow(reservationId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Reservation not found") {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 },
      );
    }

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
