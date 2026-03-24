import Link from "next/link";

export default function NotFound() {
  return (
    <section className="glass-panel rounded-[2rem] p-8 text-center sm:p-10">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
        404
      </p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl">
        Article not found
      </h1>
      <p className="mt-4 text-base leading-7 text-[var(--muted)]">
        The requested story does not exist or has been removed from the public
        news folder.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
      >
        Return to the newsroom
      </Link>
    </section>
  );
}
