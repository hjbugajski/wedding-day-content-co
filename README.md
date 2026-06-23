# Wedding Day Content Co.

Marketing site and content platform for [Wedding Day Content Co.](https://weddingdaycontent.co), built on [Payload CMS](https://payloadcms.com) and [Next.js](https://nextjs.org). The public site and the Payload admin run from the same Next.js app.

## Stack

- **Framework** — Next.js v16 (App Router, Turbopack), React v19
- **CMS** — Payload v3 with a PostgreSQL adapter and Lexical rich text
- **Media** — Mux for video, Cloudflare R2 for image storage, `sharp` for processing
- **Email** — React Email templates delivered via Resend
- **Analytics** — Umami
- **UI** — Tailwind CSS v4, Base UI, `class-variance-authority`, TanStack Form, Zod
- **Tooling** — pnpm, oxlint + oxfmt, Stylelint, Vitest (unit + Playwright browser), TypeScript
- **Secrets** — Infisical (no committed `.env`)

## Prerequisites

- Node v24 (see [.tool-versions](.tool-versions))
- pnpm v11 (see `packageManager` in [package.json](package.json))
- [Infisical CLI](https://infisical.com/docs/cli/overview) with access to this project's secrets

## Local development

There is no local `.env` — all secrets are pulled from Infisical at runtime. Any command that needs env access has an `i:` variant that wraps it in `infisical run`. Running the plain variant locally will fail with missing-env errors.

```bash
pnpm install
pnpm i:dev
```

- Public site: http://localhost:3000
- Payload admin: http://localhost:3000/admin

## Scripts

Commands that touch secrets use the `i:` prefix; see [package.json](package.json) for the full list.

| Command                              | Description                                |
| ------------------------------------ | ------------------------------------------ |
| `pnpm i:dev`                         | Start the dev server (Turbopack)           |
| `pnpm i:build`                       | Production build                           |
| `pnpm i:start`                       | Serve the production build                 |
| `pnpm i:migrate`                     | Run Payload database migrations            |
| `pnpm i:migrate:create`              | Create a new migration from schema changes |
| `pnpm generate:types`                | Regenerate `payload-types.ts`              |
| `pnpm generate:importmap`            | Regenerate the admin import map            |
| `pnpm i:email`                       | Preview React Email templates (port 3001)  |
| `pnpm test`                          | Run all Vitest projects                    |
| `pnpm test:unit`/`pnpm test:browser` | Run a single Vitest project                |
| `pnpm lint`/`pnpm fmt`               | Lint (oxlint)/format (oxfmt), with `--fix` |
| `pnpm stylelint`                     | Lint CSS                                   |
| `pnpm typecheck`                     | `tsc --noEmit`                             |

## Project structure

```
src/
  app/
    (site)/      Public-facing site (routes, globals.css)
    (payload)/   Payload admin + REST/GraphQL API
  payload/       Payload config, collections, globals, blocks, fields, hooks, migrations
  components/    React components (blocks, ui, rich-text, footer)
  services/      Email templates
  env/           Type-safe env schema (@t3-oss/env-nextjs)
  utils/         Shared helpers (cn, etc.)
docs/            Project conventions (e.g. Tailwind)
```

**Content model** — collections: clients, faqs, forms, form-submissions, images, mux-video, pages, users. Globals: navigation, footer.
