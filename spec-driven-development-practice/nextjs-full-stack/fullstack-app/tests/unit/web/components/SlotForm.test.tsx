import { fireEvent, render, screen } from "@testing-library/react";

import SlotForm from "../../../../app/web/components/SlotForm";

describe("SlotForm", () => {
  it("should submit a valid capacity and call the create handler", () => {
    const onCreateSlot = jest.fn();

    render(<SlotForm onCreateSlot={onCreateSlot} />);

    const input = screen.getByLabelText(/capacity/i);
    fireEvent.change(input, { target: { value: "12" } });
    fireEvent.click(screen.getByRole("button", { name: /add slot/i }));

    expect(onCreateSlot).toHaveBeenCalledWith(12);
  });
});
