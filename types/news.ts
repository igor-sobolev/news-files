export interface NewsFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author?: string;
}

export interface NewsItem extends NewsFrontmatter {
  slug: string;
  content: string;
  readingTimeMinutes: number;
}

export type NewsPreview = Omit<NewsItem, 'content'>;

export interface NewsPage {
  items: NewsPreview[];
  nextCursor: string | null;
  total: number;
  cachedAt: string;
}

export interface NewsSubmission {
  title: string;
  excerpt: string;
  category: string;
  content: string;
  author?: string;
}

export interface NewsSubmissionResponse {
  ok: boolean;
  message: string;
  slug?: string;
}

export interface ViewHistoryEntry {
  slug: string;
  title: string;
  viewedAt: string;
}