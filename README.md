# RPKM 2026 Frontend

Frontend application built with Astro, React, TypeScript, and Bun.

## Requirements

- Bun 1.1 or newer
- Node.js 20 or newer

## Setup

```bash
bun install
bun run hooks:install
cp .env.example .env
bun dev
```

The development server runs at `http://localhost:4321` by default.

## Scripts

```bash
bun dev
bun run build
bun run preview
bun run typecheck
bun run lint
bun run format
bun run format:check
bun run hooks:install
```

`bun run hooks:install` enables the versioned pre-commit hook in `.githooks/`.
The hook formats staged files, re-stages them, and lints staged lintable files
before each commit.

## Environment Variables

Create `.env` from `.env.example`.

| Name                  | Description                                         |
| --------------------- | --------------------------------------------------- |
| `PUBLIC_APP_NAME`     | Public application name shown in the UI.            |
| `PUBLIC_API_BASE_URL` | Public backend API base URL for frontend API calls. |

Only variables prefixed with `PUBLIC_` are exposed to browser code.

## Project Structure

## Project Structure

```text
src/
  components/     React components
    <feature>/    Components scoped to one feature/page (e.g. login/)
  layouts/        Astro layouts
  lib/            Shared frontend utilities
    client.ts     Core fetch wrapper
    env.ts        Typed access to public env vars
    api/          Backend API calls, one file per resource (e.g. api/sample.ts holds every call under that resource's routes)
  pages/          Astro file-based routes
    api/          Reserved for endpoints this Astro server serves itself (not calls to the external backend — those live in lib/api/)
  styles/         Global styles
```

Auth is cookie/session based: `lib/client.ts` sends `credentials: "include"` on
every request and redirects to `/login` on a `401` response.

## CI/CD Preparation

The repo is prepared for future CI/CD with deterministic Bun installs and
separate check commands:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run lint
bun run format:check
bun run build
```

Docker and deploy workflows are intentionally not included yet.
