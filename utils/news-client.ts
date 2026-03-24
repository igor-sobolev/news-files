import type { NewsPage } from '@/types/news';

const CACHE_PREFIX = 'current-ledger-page:';
const memoryCache = new Map<string, NewsPage>();

function getCacheKey(cursor: string | null) {
  return `${CACHE_PREFIX}${cursor ?? 'initial'}`;
}

function readStorageCache(cursor: string | null) {
  if (typeof window === 'undefined') {
    return null;
  }

  const cached = window.localStorage.getItem(getCacheKey(cursor));

  if (!cached) {
    return null;
  }

  try {
    return JSON.parse(cached) as NewsPage;
  } catch {
    return null;
  }
}

function writeStorageCache(cursor: string | null, page: NewsPage) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(getCacheKey(cursor), JSON.stringify(page));
}

export async function fetchNewsPage({
  cursor,
  timeoutMs = 6000,
  fallbackPage,
}: {
  cursor: string | null;
  timeoutMs?: number;
  fallbackPage?: NewsPage;
}) {
  const cacheKey = getCacheKey(cursor);
  const cachedPage = memoryCache.get(cacheKey) ?? readStorageCache(cursor) ?? fallbackPage;
  const requestUrl = cursor ? `/api/news?cursor=${encodeURIComponent(cursor)}` : '/api/news';
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const page = (await response.json()) as NewsPage;
    memoryCache.set(cacheKey, page);
    writeStorageCache(cursor, page);
    return page;
  } catch (error) {
    if (cachedPage) {
      return cachedPage;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Loading more news timed out. Cached pages are still available if you have visited them before.');
    }

    throw new Error('Unable to load the next page. No cached fallback source was available.');
  } finally {
    window.clearTimeout(timeoutId);
  }
}