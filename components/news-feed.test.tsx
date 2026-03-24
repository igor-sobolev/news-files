import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import type { NewsPage } from "@/types/news";
import { server } from "@/utils/test/msw-server";

import { NewsFeed } from "./news-feed";

const replaceMock = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    replace: replaceMock,
  }),
  useSearchParams: () => new URLSearchParams("loaded=2"),
}));

describe("NewsFeed", () => {
  beforeEach(() => {
    replaceMock.mockReset();

    Object.defineProperty(window, "IntersectionObserver", {
      writable: true,
      value: class PassiveIntersectionObserver {
        constructor(callback: IntersectionObserverCallback) {
          void callback;
        }

        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
        root = null;
        rootMargin = "0px";
        thresholds = [];
      },
    });
  });

  it("loads the next page when URL state requests an additional page", async () => {
    const initialPage: NewsPage = {
      items: [
        {
          slug: "story-1",
          title: "Story one",
          excerpt: "First story excerpt",
          category: "City",
          author: "Reporter",
          date: "2026-03-24T00:00:00.000Z",
          readingTimeMinutes: 1,
        },
      ],
      nextCursor: "story-1",
      total: 2,
      cachedAt: "2026-03-24T00:00:00.000Z",
    };

    server.use(
      rest.get("http://localhost/api/news", (request, response, context) => {
        if (request.url.searchParams.get("cursor") === "story-1") {
          return response(
            context.json({
              items: [
                {
                  slug: "story-2",
                  title: "Story two",
                  excerpt: "Second story excerpt",
                  category: "Business",
                  author: "Reporter",
                  date: "2026-03-23T00:00:00.000Z",
                  readingTimeMinutes: 1,
                },
              ],
              nextCursor: null,
              total: 2,
              cachedAt: "2026-03-24T00:00:00.000Z",
            }),
          );
        }

        return response(context.json(initialPage));
      }),
    );

    render(<NewsFeed initialPage={initialPage} />);

    expect(screen.getByText("Story one")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Story two")).toBeInTheDocument();
    });

    expect(replaceMock).toHaveBeenCalled();
  });
});
