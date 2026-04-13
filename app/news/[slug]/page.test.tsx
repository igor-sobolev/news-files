import { render, screen } from "@testing-library/react";

let NewsDetailPage: (props: {
  params: Promise<{ slug: string }>;
}) => Promise<JSX.Element>;

const getMockReactMarkdown = () =>
  jest.requireMock("react-markdown").default as jest.Mock;

jest.mock("@/components/news-view-tracker", () => ({
  __esModule: true,
  NewsViewTracker: () => null,
}));

jest.mock("@/utils/news", () => ({
  getRequiredNewsBySlug: jest.fn(),
}));

jest.mock("react-markdown", () => {
  const mock = jest.fn(({ children }) => (
    <div data-testid="article-content" data-source={children}>
      {children}
    </div>
  ));

  return {
    __esModule: true,
    default: mock,
  };
});

jest.mock("remark-gfm", () => ({
  __esModule: true,
  default: () => undefined,
}));

describe("NewsDetailPage", () => {
  const mockArticle = {
    slug: "daily-update",
    title: "Daily Update",
    excerpt: "A quick summary of the day.",
    category: "City",
    author: "Reporter",
    date: "2026-04-13T08:00:00.000Z",
    readingTimeMinutes: 2,
    content: "![hero](https://example.com/image.jpg)\n\n**Bold text**",
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.resetModules();

    const { getRequiredNewsBySlug } = await import("@/utils/news");
    getRequiredNewsBySlug.mockResolvedValue(mockArticle);

    ({ default: NewsDetailPage } = await import("./page"));
  });

  it("passes markdown content to ReactMarkdown so images and formatting can render", async () => {
    const pageElement = await NewsDetailPage({
      params: Promise.resolve({ slug: "daily-update" }),
    });

    render(pageElement);

    expect(screen.getByTestId("article-content")).toHaveAttribute(
      "data-source",
      mockArticle.content,
    );
    const mockReactMarkdown = getMockReactMarkdown();
    const props = mockReactMarkdown.mock.calls[0][0];

    expect(props).toEqual(
      expect.objectContaining({
        children: mockArticle.content,
      }),
    );
    expect(Array.isArray(props.remarkPlugins)).toBe(true);
    expect(props.remarkPlugins.length).toBeGreaterThan(0);
  });
});
