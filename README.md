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

## CI/CD pipeline

This repo uses GitHub Actions and Bun to automate testing and deployments to Cloudflare. Both pipelines run code quality checks (linting, formatting, type checking).

> [!CAUTION]
> `lint`, `typecheck`, and `format:check` are currently bypassed on `dev` to prevent blocking deployments due to existing, unrelated type errors.

1. Main & Dev Deployment (Deploy to Cloudflare)

- Trigger: Pushes to main or dev branches, or manual run.
- Dev Branch: Uploads the build to Cloudflare and outputs a development preview link ([Click here](https://dev-preview-rpkm2026-frontend.isd-chula.workers.dev)).
- Main Branch: Promotes the build to the live production environment.

2. Pull Request Previews (Deploy PR Preview)

- Trigger: Opening or updating any Pull Request.
- Function: Builds a staging version of the site, uploads it to an isolated Cloudflare preview URL, and posts/updates a sticky comment directly on the PR with the live link.
  `https://<hash>-rpkm2026-frontend.isd-chula.workers.dev`
