# Project notes for AI agents

## Documentation Reference

@docs/tailwind-conventions.md

## Local development

There is no local `.env`. All secrets are pulled from Infisical at runtime. Use the `i:*` script variants for anything that needs env access — `pnpm i:dev`, `pnpm i:build`, `pnpm i:migrate`, etc. Running the non-`i:` variant locally will fail with missing-env errors. See `package.json` for the full list.
