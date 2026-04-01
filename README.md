# IdeaJudge

AI-powered business idea evaluator for founders. Enter your business idea using a structured framework and receive a comprehensive startup advisor report from a simulated panel of 11 world-class investors and advisors.

## Features

- Structured idea input with live sentence preview
- AI-powered evaluation using Claude
- Viability score (1-10) with 6 subscores
- Expert panel analysis through 11 investor lenses with dynamic weighting
- Competitive reality check
- Secret sauce defensibility verdict
- Go-to-market strategy
- 90-day action plan
- BUILD / REVISE / ABANDON recommendation

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Anthropic Claude API
- Zod for validation

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/AdamAcheson/Business-Idea.git
   cd Business-Idea
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-xxxxx
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Deploy

Deploy to Vercel:

1. Push to GitHub
2. Import the repo in Vercel
3. Add `ANTHROPIC_API_KEY` as an environment variable
4. Deploy

## Project Structure

```
src/
  app/
    page.tsx              # Main page (form + results)
    layout.tsx            # Root layout
    api/evaluate/route.ts # POST endpoint for Claude evaluation
  components/
    idea-form.tsx         # Structured input form
    results-dashboard.tsx # Full report orchestrator
    score-card.tsx        # Viability score + decision badge
    expert-panel.tsx      # 11 expert analysis cards
    gtm-section.tsx       # Go-to-market strategy
    plan-section.tsx      # 90-day action plan
    loading-state.tsx     # Progressive loading UI
    ui/                   # shadcn/ui components
  lib/
    types.ts              # TypeScript interfaces
    schemas.ts            # Zod validation schemas
    prompt-builder.ts     # Claude prompt construction
    weighting.ts          # Expert weight logic by business type
    utils.ts              # Helpers and constants
```
