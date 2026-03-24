import { AddNewsForm } from "@/components/add-news-form";

export default function AddNewsPage() {
  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-4xl p-6 sm:p-8">
        <span className="inline-flex rounded-full bg-(--accent-soft) px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-strong)">
          Publish
        </span>
        <h1 className="mt-4 font-(family-name:--font-display) text-4xl leading-tight sm:text-5xl">
          Add a new story in Markdown.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-(--muted) sm:text-lg">
          The editor validates content on the client, previews the Markdown in
          real time, and posts the story to a Node.js API route that stores it
          in the public folder.
        </p>
      </div>

      <AddNewsForm />
    </section>
  );
}
