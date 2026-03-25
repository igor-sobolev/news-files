import { fireEvent, render, screen } from "@testing-library/react";

import { HistoryPanel } from "./history-panel";

describe("HistoryPanel", () => {
  it("renders an empty state without external store snapshot warnings", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    render(<HistoryPanel />);

    expect(screen.getByText(/No viewed articles yet/i)).toBeInTheDocument();
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining(
        "The result of getServerSnapshot should be cached to avoid an infinite loop",
      ),
    );

    consoleErrorSpy.mockRestore();
  });

  it("reloads and clears the local history list", async () => {
    window.localStorage.setItem(
      "current-ledger-history",
      JSON.stringify([
        { slug: "story", title: "Story", viewedAt: "2026-03-24T00:00:00.000Z" },
      ]),
    );

    render(<HistoryPanel />);

    expect(await screen.findByText("Story")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByText(/No viewed articles yet/i)).toBeInTheDocument();
  });
});
