import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { unstable_cache, revalidateTag } from "next/cache";
import { notFound } from "next/navigation";

import type {
  NewsItem,
  NewsPage,
  NewsPreview,
  NewsSubmission,
} from "@/types/news";
import { estimateReadingTime, slugify } from "@/utils/format";

const NEWS_DIRECTORY = path.join(process.cwd(), "public", "news");
const PAGE_SIZE = 10;

async function ensureNewsDirectory() {
  await fs.mkdir(NEWS_DIRECTORY, { recursive: true });
}

export function getNewsDirectory() {
  return NEWS_DIRECTORY;
}

export function getPageSize() {
  return PAGE_SIZE;
}

export function parseNewsMarkdown(fileName: string, source: string): NewsItem {
  const { data, content } = matter(source);
  const slug = fileName.replace(/\.md$/, "");

  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? content.slice(0, 140).trim()),
    category: String(data.category ?? "General"),
    author: data.author ? String(data.author) : undefined,
    date: String(data.date ?? new Date().toISOString()),
    content: content.trim(),
    readingTimeMinutes: estimateReadingTime(content),
  };
}

async function readAllNewsFromDisk() {
  await ensureNewsDirectory();

  const fileNames = (await fs.readdir(NEWS_DIRECTORY)).filter((fileName) =>
    fileName.endsWith(".md"),
  );
  const newsItems = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(NEWS_DIRECTORY, fileName);
      const source = await fs.readFile(filePath, "utf8");
      return parseNewsMarkdown(fileName, source);
    }),
  );

  return newsItems.sort((left, right) => {
    return new Date(right.date).getTime() - new Date(left.date).getTime();
  });
}

const getCachedNews = unstable_cache(readAllNewsFromDisk, ["news-all"], {
  tags: ["news"],
  revalidate: 60,
});

export async function listNews() {
  return getCachedNews();
}

export async function getNewsPage(
  cursor: string | null,
  limit = PAGE_SIZE,
): Promise<NewsPage> {
  const newsItems = await listNews();
  const startIndex = cursor
    ? newsItems.findIndex((item) => item.slug === cursor) + 1
    : 0;
  const safeStart = Math.max(0, startIndex);
  const items = newsItems
    .slice(safeStart, safeStart + limit)
    .map<NewsPreview>((item) => ({
      slug: item.slug,
      title: item.title,
      excerpt: item.excerpt,
      category: item.category,
      author: item.author,
      date: item.date,
      readingTimeMinutes: item.readingTimeMinutes,
    }));
  const lastItem = items.at(-1);
  const hasMore = safeStart + items.length < newsItems.length;

  return {
    items,
    nextCursor: hasMore && lastItem ? lastItem.slug : null,
    total: newsItems.length,
    cachedAt: new Date().toISOString(),
  };
}

export async function getNewsBySlug(slug: string) {
  const newsItems = await listNews();
  return newsItems.find((item) => item.slug === slug) ?? null;
}

export async function getRequiredNewsBySlug(slug: string) {
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return item;
}

export async function saveNewsItem(input: NewsSubmission) {
  await ensureNewsDirectory();

  const baseSlug = slugify(input.title);
  const slug = `${baseSlug}-${Date.now()}`;
  const filePath = path.join(NEWS_DIRECTORY, `${slug}.md`);
  const source = `---\ntitle: ${JSON.stringify(input.title)}\nexcerpt: ${JSON.stringify(input.excerpt)}\ncategory: ${JSON.stringify(input.category)}\ndate: ${JSON.stringify(new Date().toISOString())}\nauthor: ${JSON.stringify(input.author?.trim() || "News Desk")}\n---\n\n${input.content.trim()}\n`;

  await fs.writeFile(filePath, source, "utf8");
  revalidateTag("news", "max");

  return slug;
}
