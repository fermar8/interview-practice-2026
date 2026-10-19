import { render, screen } from "@testing-library/react";

import Footer from "../../../../app/web/components/Footer";

describe("Footer", () => {
  it("should render the footer branding and summary text", () => {
    render(<Footer />);

    expect(screen.getByText(/slot reservation dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/capacity-first workflow/i)).toBeInTheDocument();
  });
});
