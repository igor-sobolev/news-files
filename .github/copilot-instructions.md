# Copilot Instructions

## Project Overview

- Project root is the current workspace directory.
- Stack: Next.js App Router, TypeScript, Tailwind CSS, Jest, React Testing Library, and MSW.
- News content is stored as Markdown files in `public/news`.
- The application uses local filesystem storage for article creation and local browser storage for feed caching and reading history.

## Session Management

- Use a todo list for any task that spans more than one meaningful step or touches multiple files.
- Keep exactly one todo item in progress at a time and update statuses as work advances.
- Start by reading the files you plan to change and the nearest related tests before editing.
- When reporting progress, summarize decisions and outcomes, not raw command logs.
- After code changes, run the narrowest validation that proves the change, then widen to broader checks only when the change crosses boundaries.
- If a task changes behavior in feed loading, article creation, filesystem persistence, or browser history, treat that as cross-cutting work and validate both implementation and tests.

## Architecture Patterns

### App Router and component boundaries

- Default to Server Components in `app/`. Add `"use client"` only when a component needs browser APIs, React client hooks, event handlers, or mutable client-side state.
- Keep route handlers in `app/api/**/route.ts` thin. Parse requests, validate input, delegate business logic to `utils`, and return `NextResponse.json(...)`.
- Preserve `export const runtime = "nodejs"` on write routes that depend on filesystem access.

### Data and utility layering

- Keep Markdown parsing, pagination, slug generation, disk reads, and disk writes in `utils/news.ts`.
- Keep client fetch and page-cache logic in `utils/news-client.ts`.
- Keep schema validation in `utils/validation.ts` and reuse it on both client and server instead of duplicating rules.
- Keep date formatting, reading-time estimation, and slug helpers in `utils/format.ts`.
- Keep browser history state in `utils/view-history.ts`; UI should subscribe to it rather than reimplementing storage reads.

### State management

- Prefer local component state for isolated UI concerns such as form state, submission state, pagination state, and inline error messages.
- Do not introduce a global state library for this project.
- For shared browser-backed state, follow the existing external-store pattern with `useSyncExternalStore` and the `view-history` utilities.
- For async pagination state, follow the existing `NewsFeed` pattern: use refs to avoid stale closures, guard concurrent loads, and update URL state without scroll jumps.
- When synchronizing URL query state from client components, use `router.replace(...)` inside `startTransition(...)`.
- Preserve route typing with `Route` for dynamic internal links such as `/news/[slug]`.

### Hooks and component composition

- Keep components focused on rendering and interaction orchestration; move reusable logic into utilities before adding custom hooks.
- Add custom hooks only when logic is reused by multiple client components or when extracting the logic materially improves readability.
- Follow the repo's existing React patterns before introducing additional memoization. Do not add `useMemo` or `useCallback` by default unless the component already relies on referential stability or async observer behavior.
- Use `useDeferredValue`, `startTransition`, and refs only where they solve a real UI synchronization problem, as they do in the feed.

## Testing Conventions

- Co-locate tests with the implementation using `*.test.ts` and `*.test.tsx`.
- Test components with React Testing Library and assert visible behavior rather than implementation details.
- Test API routes in Node environment when appropriate and mock utility-layer dependencies instead of hitting the real filesystem.
- Use MSW for client-side request flows that hit internal API endpoints.
- Rely on `jest.setup.ts` for shared test setup, including `@testing-library/jest-dom`, fetch polyfills, MSW lifecycle, storage cleanup, and the default `IntersectionObserver` mock.
- Add targeted mocks for `next/navigation` when a component depends on pathname, router replacement, or query parameters.
- Prefer deterministic fixtures with explicit slugs, dates, and timestamps in tests.
- Cover both success and failure paths: invalid payloads, timeout behavior, cached fallbacks, empty states, and retry flows.
- When touching browser-storage utilities, verify ordering, deduplication, truncation, and clear/reload behavior.
- When touching pagination, verify cursor handling, URL `loaded` restoration, and observer-triggered loading behavior.

## Critical Gotchas

- Article creation writes Markdown files into `public/news`, so changes to submission flow must remain compatible with writable Node.js filesystem access.
- After saving a new article, cache invalidation depends on `revalidateTag("news", "max")`. Do not remove or bypass it.
- The feed uses cursor pagination where the cursor is the last loaded article slug. Off-by-one mistakes will duplicate or skip articles.
- The `loaded` query parameter represents the number of pages restored in the feed, not the number of articles.
- `fetchNewsPage` uses layered fallback behavior: in-memory cache, `localStorage`, then optional fallback page. Preserve that behavior when changing error handling.
- Client fetches for news use `cache: "no-store"`, and the GET route returns `Cache-Control: no-store, max-age=0`. Keep those aligned.
- Browser APIs such as `window`, `localStorage`, and `IntersectionObserver` must stay inside client code or guarded browser-only utilities.
- `app/news/[slug]/page.tsx` uses async `params` typing; preserve the existing Next.js route contract when editing that page.
- New article slugs are timestamp-suffixed. Tests should not assume stable generated filenames unless time is mocked.
- Markdown files in `public/news` are production data for this app. Avoid destructive edits to existing content unless the task explicitly requires it.

## Validation Expectations

- Relevant validation commands are:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- Prefer focused test execution first when the change is isolated, then run the broader suite if the change affects shared behavior.
