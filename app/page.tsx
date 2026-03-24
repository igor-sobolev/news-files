import { Suspense } from "react";

import { HistoryPanel } from "@/components/history-panel";
import { NewsFeed } from "@/components/news-feed";
import { getNewsPage } from "@/utils/news";

export default async function HomePage() {
  const initialPage = await getNewsPage(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <section className="space-y-6">
        <div className="glass-panel overflow-hidden rounded-4xl p-6 sm:p-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full bg-(--accent-soft) px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-strong)">
              Today&apos;s file-backed briefing
            </span>
            <h1 className="font-(family-name:--font-display) text-4xl leading-tight sm:text-5xl">
              Read the latest markdown news with seamless infinite pagination.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-(--muted) sm:text-lg">
              Current Ledger serves news directly from the public folder,
              preserves scroll state through URL parameters, caches loaded
              pages, and keeps a local reading history you can reload or clear.
            </p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="glass-panel rounded-4xl p-6 text-sm text-(--muted)">
              Loading the latest page state...
            </div>
          }
        >
          <NewsFeed initialPage={initialPage} />
        </Suspense>
      </section>

      <HistoryPanel />
    </div>
  );
}
