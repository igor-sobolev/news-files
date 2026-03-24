import { fireEvent, render, screen } from "@testing-library/react";

import { HistoryPanel } from "./history-panel";

describe("HistoryPanel", () => {
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
