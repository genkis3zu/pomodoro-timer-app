# UI Architecture

## Component Tree

```
App
└── GameProvider (session)
    └── TimerWrapper
        └── TimerProvider (onTimerComplete, onLog)
            └── AppContent (session)
                ├── Header
                │   ├── Logo
                │   ├── SettingsButton → SettingsModal
                │   ├── HelpButton → HelpModal
                │   ├── AudioToggle
                │   └── SignOutButton
                ├── LeftPanel
                │   └── Timer
                │       ├── ProgressBar
                │       └── Controls
                ├── RightPanel
                │   ├── [authenticated] Dashboard
                │   │   ├── AvatarDisplay
                │   │   ├── XP/Level display
                │   │   ├── SystemLog
                │   │   └── ShopButton → ShopModal
                │   └── [unauthenticated] Auth
                └── Modals
                    ├── OverdriveModal (conditional)
                    └── ShopModal (conditional)
```

## Context Provider Wrap Order

```jsx
<GameProvider session={session}>      // Outer: XP, inventory, user state
  <TimerWrapper>                      // Bridge: connects contexts
    <TimerProvider onComplete onLog>  // Inner: Timer state, mode
      <AppContent />
    </TimerProvider>
  </TimerWrapper>
</GameProvider>
```

**Important:** This wrap order ensures:
1. GameContext is available to TimerProvider for callbacks
2. TimerProvider can notify GameContext of timer completions
3. AppContent has access to both contexts

## Theme System

### Theme Flow
```
equippedItems.theme → activeEffects.visualTheme → getBackgroundClass() → CSS classes
```

### Available Themes
| Theme ID | Name | Description |
|----------|------|-------------|
| default | Default | Standard cyberpunk blue |
| matrix | Matrix | Green terminal aesthetic |
| neon_samurai | Neon Samurai | Pink/purple neon |
| gold | Gold | Premium gold accents |

### Theme Application
- **Background:** Applied via `getBackgroundClass()` in App.jsx
- **Accents:** CSS custom properties per theme
- **Gradients:** Theme-specific gradient definitions

## Component Responsibilities

### Timer.jsx
- Display countdown timer
- Mode switching (work/break)
- Overdrive trigger
- Progress visualization

### Dashboard.jsx
- User stats display (XP, level, credits)
- Avatar preview
- Session history
- Shop access

### ShopModal.jsx
- Cyberware browsing
- Purchase flow
- Inventory management
- Equipment interface

### Auth.jsx
- Login/signup forms
- Supabase auth integration
- Anonymous user handling

## State Dependencies

```
GameContext (user state)
    │
    ├── Dashboard: xp, level, credits, inventory, activeEffects
    ├── ShopModal: credits, inventory, equippedItems
    ├── AvatarDisplay: avatarConfig, equippedItems
    └── App: session, activeEffects.visualTheme

TimerContext (timer state)
    │
    ├── Timer: timeLeft, mode, isActive, overdrive
    └── AppContent: mode (for conditional UI)
```

## Responsive Design

- **Mobile First:** Base styles for mobile, enhanced for larger screens
- **Breakpoints:** Tailwind defaults (sm: 640px, md: 768px, lg: 1024px)
- **Layout:** Stacked on mobile, side-by-side on desktop
