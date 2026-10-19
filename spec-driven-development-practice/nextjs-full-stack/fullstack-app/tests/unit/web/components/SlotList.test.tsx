import { fireEvent, render, screen } from "@testing-library/react";

import SlotList from "../../../../app/web/components/SlotList";

describe("SlotList", () => {
  it("should render slot metadata and call the selection handler", () => {
    const onSelectSlot = jest.fn();
    const slots = [
      { id: "slot-1", capacity: 3, reserved: 1 },
      { id: "slot-2", capacity: 2, reserved: 0 },
    ];

    render(
      <SlotList
        slots={slots}
        selectedSlotId="slot-1"
        onSelectSlot={onSelectSlot}
      />,
    );

    expect(screen.getByText(/available slots/i)).toBeInTheDocument();
    expect(
      screen.getByText(/capacity 3 · reserved 1 · remaining 2/i),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^Select$/i }));
    expect(onSelectSlot).toHaveBeenCalledWith("slot-2");
  });
});
