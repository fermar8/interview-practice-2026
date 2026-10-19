import { fireEvent, render, screen } from "@testing-library/react";

import ReservationList from "../../../../app/web/components/ReservationList";

describe("ReservationList", () => {
  it("should render reservations and handle cancel actions", () => {
    const onCancelReservation = jest.fn();
    const reservations = [
      {
        id: "reservation-1",
        slotId: "slot-1",
        userId: "alice",
        createdAt: "2026-10-17T10:00:00.000Z",
      },
    ];

    render(
      <ReservationList
        reservations={reservations}
        onCancelReservation={onCancelReservation}
      />,
    );

    expect(screen.getByText(/reservations/i)).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(
      screen.getByText(/slot-1 · 2026-10-17 10:00:00 UTC/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancelReservation).toHaveBeenCalledWith("reservation-1");
  });
});
