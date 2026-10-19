import { render, screen } from "@testing-library/react";

import MainLayout from "../../../../app/web/components/MainLayout";

describe("MainLayout", () => {
  it("should render the header, content, and footer for the app shell", () => {
    render(
      <MainLayout>
        <div>Dashboard content</div>
      </MainLayout>,
    );

    expect(
      screen.getByRole("heading", { name: /capacity planner/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    expect(screen.getByText(/slot reservation dashboard/i)).toBeInTheDocument();
  });
});
