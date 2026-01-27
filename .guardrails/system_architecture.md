# System Architecture

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 19.x |
| Build | Vite | 7.x |
| Styling | Tailwind CSS | 4.x |
| Testing | Vitest | 2.x |
| Backend | Supabase | - |

## Project Structure

```
src/
├── components/    # UI Components
│   ├── Timer.jsx
│   ├── Dashboard.jsx
│   ├── Auth.jsx
│   ├── ShopModal.jsx
│   ├── SettingsModal.jsx
│   ├── HelpModal.jsx
│   └── ...
├── context/       # State Management
│   ├── GameContext.jsx   # User/XP/Inventory state
│   └── TimerContext.jsx  # Timer/Mode state (useReducer)
├── hooks/         # Custom Hooks
│   ├── useAudioPlayer.js
│   └── useAudioDrone.js
├── data/          # Static Data
│   ├── cyberware.js
│   └── avatars.js
├── lib/           # Utilities
│   ├── supabaseClient.js
│   └── audioPresets.js
└── test/          # Test Setup
    └── setup.js
```

## Context Architecture

### GameContext
- **Responsibility:** User state management (XP, level, credits, inventory, equipped items, avatar config)
- **Persistence:** Supabase `profiles` table
- **Key Functions:** `addSession()`, `buyItem()`, `equipItem()`, `addLog()`
- **Computed State:** `activeEffects` derived from equipped cyberware

### TimerContext
- **Responsibility:** Timer state management (mode, timeLeft, isActive, overdrive)
- **Pattern:** `useReducer` with 8 action types
- **Actions:** `SWITCH_MODE`, `TICK`, `TIMER_COMPLETE`, `TIMER_FINISH`, `START_OVERDRIVE`, `TOGGLE`, `RESET`, `END_SESSION`

## Data Flow

```
1. Authentication
   Supabase Auth → session → GameProvider → user state hydration

2. Timer Events
   TimerContext dispatch → TIMER_COMPLETE → onTimerComplete callback → GameContext.addSession()

3. State Persistence
   GameContext state change → debounced Supabase update → profiles/sessions tables

4. Active Effects
   equippedItems → computeActiveEffects() → activeEffects → UI theming/XP multipliers
```

## Supabase Tables

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | User ID (FK to auth.users) |
| xp | int4 | Current experience points |
| level | int4 | Current level |
| credits | int4 | Currency for shop |
| inventory | jsonb | Owned items array |
| equipped_items | jsonb | Currently equipped items |
| avatar_config | jsonb | Avatar customization |

### sessions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Session ID |
| user_id | uuid | User ID (FK to profiles) |
| mode | text | work/break |
| task | text | Task description |
| xp_gained | int4 | XP earned |
| created_at | timestamp | Session timestamp |

## Security

- **Row Level Security (RLS):** Both tables restricted to own user's data
- **Auto Profile Creation:** Trigger creates profile on new user signup
- **Anon Key:** Public client uses `VITE_SUPABASE_PUBLISHABLE_KEY`

## Quality Metrics (Phase 2)

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| ESLint Errors | 0 | 0 | ✅ |
| ESLint Warnings | 2 | <5 | ✅ |
| Tests Passing | 16/16 | 100% | ✅ |
| Coverage (context/) | 69.34% | >60% | ✅ |
