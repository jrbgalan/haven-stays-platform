# AGENTS.md

## Project Context

This is Haven — a luxury stays web application built with React 18, TypeScript, Vite, and OpenAI.

## Key Files

- `src/`: frontend application source (TypeScript/TSX).
- `src/api/client.ts`: standalone client managing local persistence and functions.
- `src/lib/openai.ts`: OpenAI integration service for AI Concierge, Smart Search, and Listing Helper.
- `src/lib/curatedStays.ts`: curated stays, places, and reviews catalog.
- `vite.config.js`: standard Vite configuration with `@` alias.
- `.env.local`: local environment variables (e.g. `VITE_OPENAI_API_KEY`).

## Working Notes

- Use `npm run dev` to start the local development server.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` before finishing code changes.
