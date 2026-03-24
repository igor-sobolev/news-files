"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  clearViewHistory,
  readViewHistory,
  reloadViewHistory,
  subscribeToViewHistory,
} from "@/utils/view-history";

export function HistoryPanel() {
  const items = useSyncExternalStore(
    subscribeToViewHistory,
    readViewHistory,
    () => [],
  );

  return (
    <aside className="glass-panel rounded-4xl p-5 sm:p-6 lg:sticky lg:top-28">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-(family-name:--font-display) text-2xl">
            History
          </h2>
          <p className="mt-2 text-sm leading-6 text-(--muted)">
            Reload or clear the local list of articles you have opened.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={reloadViewHistory}
          className="rounded-full border border-(--line) px-4 py-2 text-sm font-semibold text-slate-900 transition hover:border-(--accent) hover:bg-(--accent-soft)"
        >
          Reload
        </button>
        <button
          type="button"
          onClick={clearViewHistory}
          className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Clear
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-(--line) p-4 text-sm leading-6 text-(--muted)">
            No viewed articles yet.
          </p>
        ) : (
          items.map((item) => (
            <Link
              key={item.viewedAt}
              href={`/news/${item.slug}` as Route}
              className="block rounded-2xl border border-(--line) bg-white/70 p-4 transition hover:border-(--accent) hover:-translate-y-0.5"
            >
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-(--muted)">
                Viewed {new Date(item.viewedAt).toLocaleString()}
              </p>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
