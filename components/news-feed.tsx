"use client";

import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { NewsPage } from "@/types/news";
import { fetchNewsPage } from "@/utils/news-client";

import { EmptyState } from "./empty-state";
import { NewsCard } from "./news-card";

type NewsFeedProps = {
  initialPage: NewsPage;
};

export function NewsFeed({ initialPage }: NewsFeedProps) {
  const [pages, setPages] = useState<NewsPage[]>([initialPage]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pagesRef = useRef<NewsPage[]>([initialPage]);
  const loadingRef = useRef(false);
  const articles = useDeferredValue(pages.flatMap((page) => page.items));
  const lastPage = pages.at(-1);
  const targetLoadedPages = Math.max(
    1,
    Number(searchParams.get("loaded") ?? "1") || 1,
  );

  useEffect(() => {
    pagesRef.current = pages;
  }, [pages]);

  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  const syncLoadedParam = useCallback(
    (loadedCount: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (loadedCount <= 1) {
        params.delete("loaded");
      } else {
        params.set("loaded", String(loadedCount));
      }

      const query = params.toString();
      const nextRoute = (query ? `${pathname}?${query}` : pathname) as Route;

      startTransition(() => {
        router.replace(nextRoute, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const loadMore = useCallback(async () => {
    const currentPages = pagesRef.current;
    const cursor = currentPages.at(-1)?.nextCursor ?? null;

    if (loadingRef.current || !cursor) {
      return false;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const nextPage = await fetchNewsPage({ cursor });
      const updatedPages = [...currentPages, nextPage];

      pagesRef.current = updatedPages;
      setPages(updatedPages);
      syncLoadedParam(updatedPages.length);

      return true;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load more news right now. Cached pages remain available.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [syncLoadedParam]);

  useEffect(() => {
    let cancelled = false;

    if (pagesRef.current.length >= targetLoadedPages) {
      return;
    }

    const restorePages = async () => {
      while (!cancelled && pagesRef.current.length < targetLoadedPages) {
        const loaded = await loadMore();

        if (!loaded) {
          break;
        }
      }
    };

    void restorePages();

    return () => {
      cancelled = true;
    };
  }, [targetLoadedPages, loadMore]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !lastPage?.nextCursor) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMore();
        }
      },
      { rootMargin: "280px 0px" },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [lastPage?.nextCursor, loadMore]);

  if (articles.length === 0) {
    return (
      <EmptyState
        title="No news yet"
        description="Use the Add News page to publish the first story."
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 px-1 text-sm text-[var(--muted)]">
        <p>
          {articles.length} of {initialPage.total} articles loaded
        </p>
        <p>
          {lastPage?.nextCursor
            ? "Automatic pagination is active."
            : "You have reached the latest page."}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5">
        {articles.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>

      {errorMessage ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p>{errorMessage}</p>
          {lastPage?.nextCursor ? (
            <button
              type="button"
              onClick={() => {
                void loadMore();
              }}
              className="mt-3 rounded-full border border-red-300 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-100"
            >
              Retry
            </button>
          ) : null}
        </div>
      ) : null}

      <div ref={sentinelRef} className="flex justify-center py-4">
        {isLoading ? (
          <div className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm text-[var(--muted)]">
            Loading more news...
          </div>
        ) : lastPage?.nextCursor ? (
          <div className="rounded-full border border-dashed border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
            Scroll to load the next page.
          </div>
        ) : (
          <div className="rounded-full border border-dashed border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)]">
            End of the newsroom.
          </div>
        )}
      </div>
    </section>
  );
}
