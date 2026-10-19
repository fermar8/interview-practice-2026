import { fireEvent, render, screen } from "@testing-library/react";

import ReservationForm from "../../../../app/web/components/ReservationForm";

describe("ReservationForm", () => {
  it("should reserve the selected slot with the entered user id", () => {
    const onReserve = jest.fn();

    render(<ReservationForm slotId="slot-7" onReserve={onReserve} />);

    const input = screen.getByLabelText(/user id/i);
    fireEvent.change(input, { target: { value: "alice" } });
    fireEvent.click(screen.getByRole("button", { name: /reserve/i }));

    expect(onReserve).toHaveBeenCalledWith("slot-7", "alice");
  });

  it("should disable reserve when no slot is selected", () => {
    const onReserve = jest.fn();

    render(<ReservationForm slotId="" onReserve={onReserve} />);

    expect(screen.getByRole("button", { name: /reserve/i })).toBeDisabled();
  });
});
