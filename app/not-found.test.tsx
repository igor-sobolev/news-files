import { render, screen } from "@testing-library/react";

import NotFound from "./not-found";

function setup() {
  render(<NotFound />);

  return {
    heading: screen.getByRole("heading", { name: /article not found/i }),
    homeLink: screen.getByRole("link", { name: /return to the newsroom/i }),
  };
}

describe("NotFound", () => {
  it("renders the missing article message and return link", () => {
    const { heading, homeLink } = setup();

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(
      screen.getByText(/the requested story does not exist or has been removed/i),
    ).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
  });
});