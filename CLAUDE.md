# CLAUDE.md

## Commands

All commands require Infisical for secrets. Non-prefixed variants will fail locally.

- `pnpm i:dev` - Dev server
- `pnpm i:dev:clean` - Clean .next and start dev
- `pnpm i:build` - Production build
- `pnpm i:build:clean` - Clean .next and build
- `pnpm i:migrate` - Run migrations
- `pnpm i:migrate:create` - Create migration
- `pnpm migrate:dev` - Clean migrations, create, and run (dev workflow)
- `pnpm generate:types` - Generate Payload types
- `pnpm generate:importmap` - Generate Payload import map
- `pnpm lint` - Lint with oxlint (auto-fix)
- `pnpm format` - Format with oxfmt
- `pnpm stylelint` - Lint CSS (auto-fix)
- `pnpm typecheck` - Type check

## Architecture

Next.js 16 (App Router, React 19) + Payload CMS 3.x + PostgreSQL + Tailwind CSS 4.x + TypeScript.
Secrets via Infisical. Video via Mux. Media on S3-compatible storage (R2).

**Structure:**

- `src/app/(site)/` - Public frontend routes
- `src/app/(payload)/` - Payload admin panel
- `src/payload/` - Collections, globals, blocks, config
- `src/components/` - UI components and content blocks
- `src/env/` - Type-safe env validation (@t3-oss/env-nextjs)

**Patterns:**

- Server components by default; client components marked explicitly
- Block-based pages managed through Payload with nested docs plugin
- Form handling with TanStack Form + Zod 4 validation
- Role-based access control on Payload collections
- Custom encryption hooks for sensitive form data
- pnpm as package manager
