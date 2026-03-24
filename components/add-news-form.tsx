"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { NewsSubmissionResponse } from "@/types/news";
import { validateNewsSubmission } from "@/utils/validation";

import { MarkdownEditor } from "./markdown-editor";

const initialFormState = {
  title: "",
  excerpt: "",
  category: "",
  author: "",
  content: "",
};

export function AddNewsForm() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdArticle, setCreatedArticle] = useState<{
    slug: string;
    title: string;
  } | null>(null);
  const createdArticleRoute = createdArticle
    ? (`/news/${createdArticle.slug}` as Route)
    : null;

  const updateField = (name: keyof typeof initialFormState, value: string) => {
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setCreatedArticle(null);

    const validation = validateNewsSubmission(formState);

    if (!validation.success) {
      setFieldErrors(
        validation.error.issues.reduce<Record<string, string>>(
          (accumulator, issue) => {
            const field = String(issue.path[0] ?? "form");
            accumulator[field] = issue.message;
            return accumulator;
          },
          {},
        ),
      );
      setErrorMessage(
        "Please correct the highlighted fields before publishing.",
      );
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
        signal: controller.signal,
      });

      const result = (await response.json()) as NewsSubmissionResponse;

      if (!response.ok || !result.ok || !result.slug) {
        throw new Error(
          result.message || "The article could not be published.",
        );
      }

      setCreatedArticle({ slug: result.slug, title: validation.data.title });
      setFormState(initialFormState);
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.name === "AbortError"
          ? "The request timed out. Please check your connection and try again."
          : error instanceof Error
            ? error.message
            : "The article could not be published.",
      );
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel space-y-6 rounded-[2rem] p-5 sm:p-6 lg:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Title
          </span>
          <input
            value={formState.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-[1.25rem] border border-[var(--line)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            placeholder="Morning brief: new commuter route opens"
          />
          {fieldErrors.title ? (
            <p className="text-sm font-medium text-red-600">
              {fieldErrors.title}
            </p>
          ) : null}
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Category
          </span>
          <input
            value={formState.category}
            onChange={(event) => updateField("category", event.target.value)}
            className="w-full rounded-[1.25rem] border border-[var(--line)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            placeholder="City"
          />
          {fieldErrors.category ? (
            <p className="text-sm font-medium text-red-600">
              {fieldErrors.category}
            </p>
          ) : null}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Excerpt
          </span>
          <input
            value={formState.excerpt}
            onChange={(event) => updateField("excerpt", event.target.value)}
            className="w-full rounded-[1.25rem] border border-[var(--line)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            placeholder="Summarize the story in one clear sentence."
          />
          {fieldErrors.excerpt ? (
            <p className="text-sm font-medium text-red-600">
              {fieldErrors.excerpt}
            </p>
          ) : null}
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Author
          </span>
          <input
            value={formState.author}
            onChange={(event) => updateField("author", event.target.value)}
            className="w-full rounded-[1.25rem] border border-[var(--line)] bg-white/80 px-4 py-3 outline-none transition focus:border-[var(--accent)]"
            placeholder="Optional author name"
          />
          {fieldErrors.author ? (
            <p className="text-sm font-medium text-red-600">
              {fieldErrors.author}
            </p>
          ) : null}
        </label>
      </div>

      <MarkdownEditor
        value={formState.content}
        onChange={(value) => updateField("content", value)}
        error={fieldErrors.content}
      />

      {errorMessage ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {createdArticle ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p>
            Published <strong>{createdArticle.title}</strong> successfully.
          </p>
          <Link
            href={createdArticleRoute ?? "/"}
            className="mt-2 inline-flex font-semibold underline underline-offset-4"
          >
            Open the article
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Publishing..." : "Publish article"}
        </button>
        <p className="text-sm text-[var(--muted)]">
          Articles are stored as `.md` files in the public folder.
        </p>
      </div>
    </form>
  );
}
