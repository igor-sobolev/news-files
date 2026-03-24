import { estimateReadingTime, formatNewsDate, slugify } from "./format";

describe("format utilities", () => {
  it("formats article dates for display", () => {
    expect(formatNewsDate("2026-03-24T05:30:00.000Z")).toContain("2026");
  });

  it("returns a minimum reading time of one minute", () => {
    expect(estimateReadingTime("short copy")).toBe(1);
  });

  it("creates stable slugs", () => {
    expect(slugify("City Hall: New Transit Plan!")).toBe(
      "city-hall-new-transit-plan",
    );
  });
});
