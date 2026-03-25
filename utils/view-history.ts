import type { ViewHistoryEntry } from "@/types/news";

const HISTORY_KEY = "current-ledger-history";
const HISTORY_EVENT = "current-ledger-history-change";
const EMPTY_HISTORY: ViewHistoryEntry[] = [];

let cachedHistorySource = "";
let cachedHistorySnapshot: ViewHistoryEntry[] = EMPTY_HISTORY;

function emitViewHistoryChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(HISTORY_EVENT));
}

export function readViewHistory() {
  if (typeof window === "undefined") {
    return EMPTY_HISTORY;
  }

  const raw = window.localStorage.getItem(HISTORY_KEY) ?? "";

  if (!raw) {
    cachedHistorySource = "";
    cachedHistorySnapshot = EMPTY_HISTORY;
    return cachedHistorySnapshot;
  }

  if (raw === cachedHistorySource) {
    return cachedHistorySnapshot;
  }

  try {
    cachedHistorySource = raw;
    cachedHistorySnapshot = (JSON.parse(raw) as ViewHistoryEntry[]).slice(0, 8);
    return cachedHistorySnapshot;
  } catch {
    cachedHistorySource = "";
    cachedHistorySnapshot = EMPTY_HISTORY;
    return cachedHistorySnapshot;
  }
}

export function getViewHistoryServerSnapshot() {
  return EMPTY_HISTORY;
}

export function recordViewHistory(entry: ViewHistoryEntry) {
  if (typeof window === "undefined") {
    return;
  }

  const items = readViewHistory().filter((item) => item.slug !== entry.slug);
  const nextItems = [entry, ...items].slice(0, 8);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextItems));
  emitViewHistoryChange();
}

export function clearViewHistory() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(HISTORY_KEY);
  emitViewHistoryChange();
}

export function subscribeToViewHistory(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(HISTORY_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(HISTORY_EVENT, handleChange);
  };
}

export function reloadViewHistory() {
  emitViewHistoryChange();
}
