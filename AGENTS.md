# Repository Guidelines

## Project Structure & Module Organization

RentNest is a TypeScript/Express API. `src/server.ts` starts the application; `src/app.ts` configures middleware and routes. Domain code is grouped under `src/modules/<feature>/`, usually with controller, service, route, validation, and interface files. Shared infrastructure lives in the other `src/` directories. Prisma models are split across `prisma/schema/`, with migrations in `prisma/migrations/`. `api/index.ts` is the Vercel entry point, and `RentNest.postman_collection.json` documents API requests. Treat `dist/` and `prisma/generated/` as generated output.

## Build, Test, and Development Commands

- `pnpm install` installs dependencies using the committed lockfile.
- `pnpm dev` runs the API with `tsx` and reloads on source changes.
- `pnpm build` generates the Prisma client and compiles TypeScript into `dist/`.
- `pnpm start` runs the compiled server from `dist/server.js`.
- `pnpm seed:admin` upserts the configured administrator account.
- `pnpm seed` loads demo users, properties, rentals, payments, and reviews.
- `pnpm prisma migrate deploy` applies committed migrations to an existing database.

`pnpm test` is currently a failing placeholder; do not present it as a working verification step.

## Coding Style & Naming Conventions

Use strict TypeScript, double quotes, semicolons, and four-space indentation, matching surrounding files. Keep feature files named `<feature>.<role>.ts`, for example `payment.service.ts` and `rental.validation.ts`. Use `camelCase` for functions and variables, `PascalCase` for classes and types, and uppercase values for enum-style statuses. Controllers should handle HTTP concerns, services should contain business logic, and Zod schemas should validate request input. Run `pnpm build` before submitting changes; ESLint configuration exists, but no lint script is currently defined.

## Testing Guidelines

No automated test framework or coverage threshold is configured. For now, verify changes with `pnpm build` and exercise affected endpoints through the Postman collection. When adding tests, colocate them with the feature or use a top-level `tests/` directory, name files `*.test.ts`, and add a real `pnpm test` script in the same change.

## Commit & Pull Request Guidelines

History follows Conventional Commit-style prefixes such as `feat:`, `fix:`, `refactor:`, and `chore:`. Keep commits focused and write imperative summaries. Pull requests should explain behavior changes, identify affected routes or migrations, link the relevant issue, and include request/response examples for API changes. Note new environment variables and provide screenshots only when documentation or externally visible output changes.

## Security & Configuration

Copy `.env.example` for local setup and never commit secrets, Stripe keys, tokens, or production credentials. Seeds create known demo accounts and are not production-safe defaults.
