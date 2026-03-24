import type { Route } from "next";
import Link from "next/link";

const navigationItems = [
  { href: "/", label: "Latest News" },
  { href: "/add", label: "Add News" },
] satisfies Array<{ href: Route; label: string }>;

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--line) bg-[rgba(248,242,232,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--accent) font-(family-name:--font-display) text-lg font-semibold text-white shadow-lg shadow-[rgba(203,95,45,0.22)]">
            CL
          </span>
          <div>
            <p className="font-(family-name:--font-display) text-xl leading-none">
              Current Ledger
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-(--muted)">
              Markdown newsroom
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 rounded-full border border-(--line) bg-white/70 p-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-(--muted) transition hover:bg-(--accent-soft) hover:text-(--accent-strong)"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
