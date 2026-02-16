# CLAUDE.md

## Commands

All local commands requiring secrets use `i:` (Infisical) prefix. Always prefer `i:` variants.

**Development**

- `pnpm i:dev` - Dev server (Turbopack)
- `pnpm i:dev:clean` - Clean `.next` then dev server
- `pnpm i:build` - Production build
- `pnpm i:build:clean` - Clean `.next` then production build

**Database**

- `pnpm i:migrate` - Run migrations
- `pnpm i:migrate:create` - Create migration
- `pnpm migrate:dev` - Reset migrations, create new, and run (dev workflow)

**Code Quality**

- `pnpm format` - Format with oxfmt
- `pnpm lint` - Lint with oxlint (type-aware, auto-fix)
- `pnpm stylelint` - Lint CSS (auto-fix)
- `pnpm typecheck` - TypeScript type checking

**Payload CMS**

- `pnpm generate:types` - Generate types from Payload schema
- `pnpm generate:importmap` - Generate Payload admin import map

## Architecture

Next.js 15 (App Router, React 19) with Payload CMS 3.x, PostgreSQL, Tailwind CSS 4.x, TypeScript. Infisical for secrets, Mux for video, S3/R2 for media.

**Structure**

- `src/app/(site)/` - Public frontend routes
- `src/app/(payload)/` - Payload admin panel
- `src/payload/` - Collections, globals, blocks, config
- `src/components/` - UI components and blocks
- `src/env/` - Type-safe env vars (@t3-oss/env-nextjs)

**Patterns**

- Server components by default; client components marked explicitly
- Block-based content system (Hero, Gallery, Form, etc.)
- Lexical rich text editor
- Role-based access control on collections
- Form handling with React Hook Form + Zod
- Encrypted form submissions
- pnpm as package manager
