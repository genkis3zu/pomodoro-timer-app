# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pomodoro Focus - A cyberpunk-themed Pomodoro timer with gamification elements (XP system, avatar customization, shop for cyberware/themes). Built with React 19, Vite 7, Tailwind CSS 4, and Supabase for auth/data persistence.

## Development Commands

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Production build to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key

Database schema is in `supabase_schema.sql` - run in Supabase SQL editor when setting up.

## Architecture

### Context Providers (wrap order in App.jsx)
```
GameProvider (session) → TimerProvider (onComplete, onLog) → AppContent
```

- **GameContext** (`src/context/GameContext.jsx`): User state (XP, level, credits, inventory, equipped items, avatar config), session history, Supabase persistence. Computes `activeEffects` from equipped cyberware.
- **TimerContext** (`src/context/TimerContext.jsx`): Timer state (mode, timeLeft, isActive), overdrive logic. Triggers `onTimerComplete` callback to GameContext.

### Data Flow
1. Timer completes → TimerContext calls `onTimerComplete(mode, isOverdrive)`
2. TimerWrapper calculates XP → calls `GameContext.addSession()`
3. GameContext applies `activeEffects.xpMultiplier`, updates local state, persists to Supabase

### Key Directories
- `src/components/` - UI components (Timer, Dashboard, ShopModal, Auth, etc.)
- `src/context/` - React contexts (GameContext, TimerContext)
- `src/data/` - Static data (cyberware catalog, avatar parts)
- `src/hooks/` - Audio hooks (useAudioPlayer, useAudioDrone)
- `src/lib/` - Utilities (supabaseClient, audioPresets)

### Supabase Tables
- `profiles` - User state (XP, level, credits, inventory, equipped_items, avatar_config)
- `sessions` - Pomodoro history (mode, task, xp_gained, timestamps)

Both tables have RLS policies restricting access to own user's data. New user trigger auto-creates profile.

## Team Workflow (Antigravity Agent System)

This project uses a three-role AI development workflow defined in `.guardrails/`:

| Role | Responsibility |
|------|----------------|
| **Commander** | PM/strategy. Defines tasks, provides Context Block, makes final decisions |
| **ClaudeCode** | Implementation. Executes tasks, reports Diff/Metrics/Docs |
| **Codex** | Audit. Reviews with MUST/SHOULD/CONSIDER priorities, provides verification steps |

### Output Format (ClaudeCode)
```
Intent/What changed:
Diff (files/highlights):
Results (numbers):
Artifacts (branch/sha/deploy URLs):
Risks/TODO:
Questions:
```

### Conventions
- Commit messages: Conventional Commits (`feat:`, `fix:`, `perf:`, `chore:`)
- Metrics: Report numbers (bundle size, LCP, CLS, etc.)
- Docs: Update PLAN.md, CHANGELOG.md, SESSION_SUMMARY.md when applicable
- Priority order: MUST → SHOULD → CONSIDER

## Technical Notes

- **Tailwind v4**: Uses new config format (`@tailwindcss/postcss` plugin)
- **React 19**: Uses latest React features
- **ESLint**: Uses flat config format (`eslint.config.js`)
- **Theme system**: Visual themes controlled by `equippedItems.theme` → `activeEffects.visualTheme` → `getBackgroundClass()` in App.jsx
- **Audio system**: Ambient audio per mode (work/break) + alarm, managed by `useAudioPlayer` hook
