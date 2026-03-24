export function SiteFooter() {
  return (
    <footer className="border-t border-(--line) bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-(--muted) sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          Current Ledger stores news as Markdown files in the public directory.
        </p>
        <p>
          Built with Next.js App Router, TypeScript, Tailwind CSS, and Jest.
        </p>
      </div>
    </footer>
  );
}
