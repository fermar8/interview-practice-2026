import { render, screen } from "@testing-library/react";

import SlotReservationDashboard from "../../../../app/web/components/SlotReservationDashboard";

describe("SlotReservationDashboard", () => {
  it("should show a database error when the data source is unavailable", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("Database unavailable"));

    render(<SlotReservationDashboard />);

    expect(
      await screen.findByRole("heading", {
        name: /database connection unavailable/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/slot-1/i)).not.toBeInTheDocument();
  });
});
