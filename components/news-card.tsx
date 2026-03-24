"use client";

import type { Route } from "next";
import Link from "next/link";

import type { NewsPreview } from "@/types/news";
import { formatNewsDate } from "@/utils/format";
import { recordViewHistory } from "@/utils/view-history";

type NewsCardProps = {
  article: NewsPreview;
};

export function NewsCard({ article }: NewsCardProps) {
  const articleRoute = `/news/${article.slug}` as Route;

  return (
    <article className="glass-panel rounded-[1.75rem] p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(30,41,59,0.18)] sm:p-6">
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-(--muted)">
        <span className="rounded-full bg-(--accent-soft) px-3 py-1 text-(--accent-strong)">
          {article.category}
        </span>
        <span>{formatNewsDate(article.date)}</span>
      </div>

      <h2 className="mt-4 font-(family-name:--font-display) text-2xl leading-tight sm:text-[2rem]">
        {article.title}
      </h2>
      <p className="mt-3 text-base leading-7 text-(--muted)">
        {article.excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-(--muted)">
        <span>{article.readingTimeMinutes} min read</span>
        <Link
          href={articleRoute}
          onClick={() =>
            recordViewHistory({
              slug: article.slug,
              title: article.title,
              viewedAt: new Date().toISOString(),
            })
          }
          className="rounded-full border border-(--line) px-4 py-2 font-semibold text-slate-900 transition hover:border-(--accent) hover:bg-(--accent) hover:text-white"
        >
          Open article
        </Link>
      </div>
    </article>
  );
}
