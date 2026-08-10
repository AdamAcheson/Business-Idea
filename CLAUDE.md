# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint
- No test framework is configured

## Architecture

IdeaJudge is a single-page Next.js 16 app (App Router) that evaluates business ideas using the Anthropic Claude API. The app has one page and one API endpoint.

**Data flow:** User fills `IdeaForm` → POST to `/api/evaluate` → Claude returns structured JSON → validated by Zod → rendered in `ResultsDashboard`.

**API route** (`src/app/api/evaluate/route.ts`): Validates form input with `formDataSchema`, builds a system+user prompt, calls Claude (claude-sonnet-5), parses the JSON response, validates against `evaluationResponseSchema`, and returns it. The prompt instructs Claude to respond as a panel of 11 investor/advisor personas.

**Key lib modules:**
- `schemas.ts` — Zod schemas for both form input validation and LLM output validation. The `evaluationResponseSchema` defines the full contract between the API and frontend.
- `types.ts` — TypeScript interfaces mirroring the Zod schemas. Keep these in sync.
- `prompt-builder.ts` — Constructs the system prompt (persona definitions, JSON schema spec, rules) and user prompt (form data + weighting instructions).
- `weighting.ts` — Maps business types to expert weight multipliers. Experts default to 1.0x; certain business types boost specific experts (e.g., SaaS boosts Bezos/Thiel).

**Frontend:** `page.tsx` is a client component managing `EvaluationState` (idle/loading/success/error). Display components (`score-card`, `expert-panel`, `gtm-section`, `plan-section`) are pure presentational, receiving typed props from `ResultsDashboard`.

**UI:** Uses shadcn/ui components in `src/components/ui/`. Add new ones via `npx shadcn@latest add <component>`.

## Environment

Requires `ANTHROPIC_API_KEY` in `.env.local` (see `.env.example`).
