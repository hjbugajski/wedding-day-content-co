# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

**Development**

- `pnpm i:dev` - Start development server with Infisical secrets
- `pnpm dev` - Start development server without secrets
- `pnpm i:dev:clean` - Clean build and start dev with secrets
- `pnpm build` - Build production bundle
- `pnpm i:build` - Build with Infisical secrets

**Database & Migrations**

- `pnpm i:migrate` - Run Payload CMS migrations with secrets
- `pnpm i:migrate:create` - Create new migration with secrets
- `pnpm migrate:dev` - Clean migrations, create new one, and run (development workflow)

**Code Quality**

- `pnpm lint:all` - Run all linting (prettier, eslint, stylelint)
- `pnpm prettier:fix` - Fix prettier formatting
- `pnpm eslint:fix` - Fix ESLint issues
- `pnpm stylelint:fix` - Fix CSS/style issues

**Payload CMS**

- `pnpm i:generate:types` - Generate TypeScript types from Payload schema
- `pnpm i:generate:importmap` - Generate import map for Payload admin

## Architecture Overview

**Tech Stack:**

- Next.js 15 with App Router and React 19
- Payload CMS 3.x as headless CMS with PostgreSQL
- Tailwind CSS 4.x for styling
- TypeScript throughout
- Infisical for secrets management
- Mux for video handling
- S3-compatible storage (R2) for media

**Application Structure:**

- **Frontend Routes**: `src/app/(site)` - Public website with dynamic pages
- **Admin Routes**: `src/app/(payload)` - Payload CMS admin panel
- **CMS Configuration**: `src/payload/` - All Payload collections, globals, blocks, and configuration
- **Components**: `src/components/` - Reusable UI components and blocks
- **Environment**: `src/env/` - Type-safe environment variable validation using @t3-oss/env-nextjs

**Content Management:**

- Pages are managed through Payload CMS with nested docs plugin
- Block-based content system with components like Hero, Gallery, Form, etc.
- Rich text editing with Lexical editor
- Form builder with encrypted submissions
- Client management system for wedding business

**Key Patterns:**

- Server components by default with client components marked explicitly
- Type-safe environment variables split between client/server
- Payload collections use role-based access control
- All media stored in S3-compatible storage with CDN
- Database migrations managed through Payload CLI
- Form handling with React Hook Form and Zod validation

**Development Notes:**

- Uses `pnpm` as package manager
- Infisical integration for secret management (commands prefixed with `i:`)
- Live preview functionality built into Payload admin
- Custom encryption hooks for sensitive form data
- Styled with custom Tailwind configuration and CSS custom properties
