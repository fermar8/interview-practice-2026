import { render, screen } from "@testing-library/react";

import Header from "../../../../app/web/components/Header";

describe("Header", () => {
  it("should render the app branding and status text", () => {
    render(<Header />);

    expect(screen.getByText("Slot Reservation")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /capacity planner/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/live availability/i)).toBeInTheDocument();
  });
});
