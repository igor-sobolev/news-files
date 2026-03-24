# Current Ledger

Current Ledger is a simple news application built with Next.js App Router, TypeScript, Tailwind CSS, and a Node.js-backed file storage model. News articles are stored as Markdown files in the public folder, rendered on the server, and paginated automatically on the client with IntersectionObserver.

## Features

- App Router project structure with TypeScript and Tailwind CSS
- Fixed header navigation with dedicated latest-news and add-news pages
- Server-side Markdown ingestion from `public/news`
- Automatic infinite pagination with 10 articles per page
- URL query persistence through the `loaded` search parameter
- Client-side page caching with in-memory and localStorage fallbacks
- Article preview cards and dedicated detail pages
- Local reading history with reload and clear controls
- Markdown editor with toolbar shortcuts and live preview
- Client validation, request timeouts, and API error responses
- Jest and React Testing Library coverage for components, utilities, and API routes

## Why there are no SSL issues

This project does not depend on external news APIs. All content is loaded from local Markdown files and internal API routes, so common SSL certificate and external connectivity issues are avoided by design.

## Project Structure

```text
app/
  add/
  api/news/
  news/[slug]/
components/
public/news/
types/
utils/
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

## Authoring News

Use the Add News page to submit a story. The server writes each article as a Markdown file into `public/news` with YAML frontmatter for title, excerpt, category, date, and author.

## Testing Notes

- Tests are co-located with the source files they validate.
- API route tests use Jest mocks.
- Component tests use React Testing Library.
- Feed pagination uses MSW to mock the internal API.

## Scripts

- `npm run dev` - Start the local development server
- `npm run build` - Create the production build
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run test` - Run the Jest suite once
- `npm run test:watch` - Run Jest in watch mode

## Notes on File Storage

The app is designed for a Node.js server environment where the process can write to the project filesystem. If you deploy to a read-only or serverless platform, the article submission route will need to be adapted to use persistent storage.
