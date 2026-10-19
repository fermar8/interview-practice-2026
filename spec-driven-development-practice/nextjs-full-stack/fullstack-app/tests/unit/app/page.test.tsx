const replace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

import { render } from "@testing-library/react";

import HomePage from "../../../app/page";

describe("HomePage", () => {
  it("should redirect to the web application route", () => {
    render(<HomePage />);

    expect(replace).toHaveBeenCalledWith("/web");
  });
});
