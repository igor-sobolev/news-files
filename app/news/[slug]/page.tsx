import type { Metadata } from "next";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { NewsViewTracker } from "@/components/news-view-tracker";
import { formatNewsDate } from "@/utils/format";
import { getRequiredNewsBySlug } from "@/utils/news";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getRequiredNewsBySlug(slug);

  return {
    title: `${article.title} | Current Ledger`,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await getRequiredNewsBySlug(slug);

  return (
    <article className="glass-panel rounded-4xl p-6 sm:p-8 lg:p-10">
      <NewsViewTracker slug={article.slug} title={article.title} />

      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-(--muted)">
        <span className="rounded-full bg-(--accent-soft) px-3 py-1 font-semibold text-(--accent-strong)">
          {article.category}
        </span>
        <span>{formatNewsDate(article.date)}</span>
        <span>{article.readingTimeMinutes} min read</span>
        <span>{article.author ?? "News Desk"}</span>
      </div>

      <h1 className="max-w-4xl font-(family-name:--font-display) text-4xl leading-tight sm:text-5xl">
        {article.title}
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-(--muted)">
        {article.excerpt}
      </p>

      <div className="prose-news mt-10 max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
