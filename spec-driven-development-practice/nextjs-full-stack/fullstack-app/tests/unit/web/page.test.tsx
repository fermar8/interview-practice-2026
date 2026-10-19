import { render, screen } from "@testing-library/react";

import WebPage from "../../../app/web/page";

describe("page", () => {
  it("should render the slot reservation page heading", () => {
    render(<WebPage />);

    expect(
      screen.getAllByRole("heading", { name: /available slots/i }).length,
    ).toBeGreaterThan(0);
  });
});
