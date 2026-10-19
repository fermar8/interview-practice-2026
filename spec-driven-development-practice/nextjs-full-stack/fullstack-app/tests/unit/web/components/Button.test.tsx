import { fireEvent, render, screen } from "@testing-library/react";

import Button from "../../../../app/web/components/Button";

describe("Button", () => {
  it("should render its label and call the click handler", () => {
    const onClick = jest.fn();

    render(
      <Button onClick={onClick} variant="primary">
        Reserve now
      </Button>,
    );

    const button = screen.getByRole("button", { name: /reserve now/i });
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
