jest.mock("next/cache", () => ({
  unstable_cache: (callback: (...args: unknown[]) => unknown) => callback,
  revalidateTag: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

import { parseNewsMarkdown } from "./news";

describe("parseNewsMarkdown", () => {
  it("extracts frontmatter and content from a markdown file", () => {
    const article = parseNewsMarkdown(
      "sample-story.md",
      `---\ntitle: Sample Story\nexcerpt: Quick summary\ncategory: City\ndate: 2026-03-24T00:00:00.000Z\nauthor: News Desk\n---\n\nThis is the full article body with enough words to generate a reading time estimate.`,
    );

    expect(article.slug).toBe("sample-story");
    expect(article.title).toBe("Sample Story");
    expect(article.category).toBe("City");
    expect(article.content).toContain("full article body");
    expect(article.readingTimeMinutes).toBeGreaterThanOrEqual(1);
  });
});
