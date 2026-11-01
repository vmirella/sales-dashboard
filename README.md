# Sales Dashboard

A sales analytics dashboard for a fictional online store, built with **Next.js (App Router)**, **TypeScript** and **Tailwind CSS**.

> Work in progress. This README will be completed with screenshots, a live demo link and technical decisions.

## Features (planned)

- KPI cards with change vs. the previous period
- Revenue over time (area chart) and revenue by category (bar chart) with Recharts
- Orders table with sorting, search and pagination
- Date range filter stored in the URL (`/?range=7d|30d|90d`)
- Dark mode, loading skeletons and responsive layout

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the development server                   |
| `npm run build`     | Create a production build                      |
| `npm run lint`      | Run ESLint                                     |
| `npm run typecheck` | Generate route types and run the TS compiler   |
| `npm run format`    | Format the code with Prettier                  |
| `npm run commit`    | Interactive, Conventional Commits-style prompt |

## Project structure

```
src/
  app/              Routes, layout and the API route (/api/orders)
  components/       UI components (dashboard/, ui/)
  data/             Deterministic fake dataset
  lib/              Pure helpers: metrics, formatting, date ranges
  types/            Shared TypeScript types
```

## Commit convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are enforced with
Husky + Commitlint. Use `npm run commit` for a guided prompt, or write the message yourself:

```
type(scope): short description in the imperative mood
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`.
The header is limited to 72 characters.

Git hooks (Husky):

- `pre-commit`: runs `lint-staged` (ESLint + Prettier on staged files)
- `commit-msg`: validates the message with Commitlint

## Data

The dataset is generated with a seeded PRNG and a fixed reference date, so it is deterministic and
safe to prerender. It contains no real customer data.
