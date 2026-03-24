import {
  clearViewHistory,
  readViewHistory,
  recordViewHistory,
} from "./view-history";

describe("view history utilities", () => {
  it("records recent history entries and keeps the latest first", () => {
    recordViewHistory({
      slug: "first",
      title: "First",
      viewedAt: "2026-03-24T00:00:00.000Z",
    });
    recordViewHistory({
      slug: "second",
      title: "Second",
      viewedAt: "2026-03-24T01:00:00.000Z",
    });

    expect(readViewHistory()).toEqual([
      { slug: "second", title: "Second", viewedAt: "2026-03-24T01:00:00.000Z" },
      { slug: "first", title: "First", viewedAt: "2026-03-24T00:00:00.000Z" },
    ]);
  });

  it("clears the local history list", () => {
    recordViewHistory({
      slug: "first",
      title: "First",
      viewedAt: "2026-03-24T00:00:00.000Z",
    });
    clearViewHistory();
    expect(readViewHistory()).toEqual([]);
  });
});
