# Frontend System Architecture (v2.0)

## Overview
Pomodoro Focus のフロントエンド（React SPA）アーキテクチャを定義する。
サイバーパンク風のUIデザインとゲーミフィケーション要素を特徴とする。

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| State | React Context API |
| Linting | ESLint 9 (Flat Config) |

---

## Directory Structure
```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root component, providers setup
├── App.css               # Global styles
├── index.css             # Tailwind directives
├── components/           # UI Components
│   ├── Timer.jsx         # タイマー表示・制御
│   ├── Dashboard.jsx     # XP・履歴・アバター表示
│   ├── Auth.jsx          # ログイン/サインアップ
│   ├── ShopModal.jsx     # Cyberwareショップ
│   ├── SettingsModal.jsx # オーディオ設定
│   ├── HelpModal.jsx     # ヘルプ画面
│   ├── OverdriveModal.jsx # Overdrive確認
│   ├── AvatarDisplay.jsx # アバター描画
│   ├── ProgressBar.jsx   # 進捗バー
│   ├── Controls.jsx      # タイマー操作ボタン
│   └── SystemLog.jsx     # システムログ表示
├── context/              # State Management
│   ├── TimerContext.jsx  # タイマー状態
│   └── GameContext.jsx   # ゲーム状態（XP, インベントリ等）
├── hooks/                # Custom Hooks
│   ├── useAudioPlayer.js # オーディオ再生
│   └── useAudioDrone.js  # 環境音ループ
├── data/                 # Static Data
│   ├── cyberware.js      # Cyberwareカタログ
│   └── avatars.js        # アバターパーツ定義
└── lib/                  # Utilities
    ├── supabaseClient.js # Supabase接続
    └── audioPresets.js   # オーディオプリセット
```

---

## Context Architecture

### Provider Hierarchy
```
<GameProvider session={session}>
  <TimerWrapper session={session}>
    <TimerProvider onTimerComplete={...} onLog={...}>
      <AppContent session={session} />
    </TimerProvider>
  </TimerWrapper>
</GameProvider>
```

### TimerContext
| State | Type | Description |
|-------|------|-------------|
| `mode` | 'work' \| 'break' | 現在のモード |
| `timeLeft` | number | 残り秒数 |
| `isActive` | boolean | タイマー稼働中 |
| `totalTime` | number | モード開始時の総秒数 |
| `overdriveActive` | boolean | Overdrive中 |
| `showOverdrivePrompt` | boolean | Overdrive確認表示 |

| Action | Description |
|--------|-------------|
| `toggleTimer()` | 開始/一時停止 |
| `resetTimer()` | リセット |
| `switchMode(mode)` | モード切替 |
| `startOverdrive()` | Overdrive開始 (+10分) |
| `endSession()` | セッション終了 |

### GameContext
| State | Type | Description |
|-------|------|-------------|
| `totalXP` | number | 累計XP |
| `level` | number | レベル (XP/100 + 1) |
| `credits` | number | ショップ通貨 |
| `history` | array | セッション履歴 |
| `inventory` | array | 所持アイテムID |
| `equippedItems` | object | 装備中アイテム |
| `avatarConfig` | object | アバター設定 |
| `activeEffects` | object | 計算済み効果 (xpMultiplier等) |
| `systemLogs` | array | システムログ |

---

## Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `Timer` | タイマー円形表示、カウントダウン、モード表示 |
| `Dashboard` | XP/レベル表示、現在タスク入力、履歴、アバター |
| `ShopModal` | Cyberware購入、装備、アバターカスタマイズ |
| `Auth` | Supabase認証フォーム |
| `AvatarDisplay` | SVG/画像レイヤーでアバター描画 |

---

## Styling System

### Tailwind CSS 4
- `@tailwindcss/postcss` プラグイン使用
- `postcss.config.js` で設定

### Design Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `glass` | backdrop-blur + border | グラスモーフィズム |
| `breathing-bg` | opacity animation | 背景脈動 |
| Mode colors | blue (work), emerald (break) | モード別配色 |

### Theme System
```javascript
// App.jsx - getBackgroundClass()
activeEffects.visualTheme → 'default' | 'matrix' | 'neon_samurai' | 'gold'
```

---

## Audio System

### useAudioPlayer Hook
```javascript
useAudioPlayer({
  src: audioUrl,
  volume: 0.5,
  loop: true,
  enabled: shouldPlay
});
```

### Audio Categories
| Category | Purpose |
|----------|---------|
| `work` | 集中モード環境音 |
| `break` | 休憩モード環境音 |
| `alarm` | タイマー終了通知音 |

---

## Data Flow

### Timer Complete Flow
```
Timer reaches 0
  ↓
TimerContext: showOverdrivePrompt or auto-complete
  ↓
User choice: startOverdrive() or endSession()
  ↓
TimerWrapper: handleTimerComplete(mode, isOverdrive)
  ↓
GameContext: addSession() → XP計算 → Supabase保存
```

### Shop Purchase Flow
```
User clicks Buy
  ↓
GameContext: buyItem(itemId)
  ↓
Check credits & inventory
  ↓
Update local state + Supabase persist
  ↓
addLog() for feedback
```

---

## Quality Gates
- **Lint**: `npm run lint` (0 errors)
- **Build**: `npm run build` (dist/ 生成確認)
- **Dev**: `npm run dev` で http://localhost:5173 動作確認

---

## Performance Considerations
1. **Context分離**: Timer/Game を分離し、不要な再レンダリング防止
2. **useMemo**: `activeEffects` 計算をメモ化
3. **useCallback**: イベントハンドラをメモ化

---

## TBD
- [ ] React.memo for component optimization
- [ ] Suspense/lazy loading for modals
- [ ] PWA support (service worker)
- [ ] Accessibility audit (WCAG 2.1)
