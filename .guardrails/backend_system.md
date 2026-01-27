# Backend System Architecture (v2.0)

## Overview
Pomodoro Focus のバックエンド（データ永続化・認証）アーキテクチャを定義する。
Supabase を BaaS として使用し、Row Level Security (RLS) でユーザーデータを保護する。

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| BaaS | Supabase (PostgreSQL + Auth) |
| Client SDK | @supabase/supabase-js ^2.86.0 |
| Auth Method | Supabase Auth (Email/Password) |
| Security | Row Level Security (RLS) |

---

## Database Schema

### profiles テーブル
```sql
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  title text,
  level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  credits integer DEFAULT 0,
  inventory text[] DEFAULT ['theme_default'],
  equipped_items jsonb DEFAULT '{"theme": "theme_default", "audio": null, "implants": []}',
  avatar_config jsonb DEFAULT '{"base": "base_male_1", "cyberware": [], "background": "bg_default"}',
  updated_at timestamptz
)
```

### sessions テーブル
```sql
sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  start_time timestamptz,
  end_time timestamptz,
  mode text,        -- 'work' | 'break'
  task text,
  xp_gained integer DEFAULT 0,
  created_at timestamptz
)
```

---

## Row Level Security (RLS) Policies

| Table | Policy | Rule |
|-------|--------|------|
| profiles | SELECT | `auth.uid() = id` |
| profiles | UPDATE | `auth.uid() = id` |
| profiles | INSERT | `auth.uid() = id` |
| sessions | SELECT | `auth.uid() = user_id` |
| sessions | INSERT | `auth.uid() = user_id` |

---

## Supabase Client (`src/lib/supabaseClient.js`)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## Data Operations (GameContext)

### Read Operations
| Method | Table | Description |
|--------|-------|-------------|
| `fetchProfile()` | profiles | ユーザープロファイル取得、なければ自動作成 |
| `fetchHistory()` | sessions | 直近50件のセッション履歴取得 |

### Write Operations
| Method | Table | Description |
|--------|-------|-------------|
| `addSession()` | sessions + profiles | セッション追加 + XP/Credits更新 |
| `buyItem()` | profiles | インベントリ・クレジット更新 |
| `equipItem()` | profiles | equipped_items / avatar_config更新 |
| `saveProfile()` | profiles | 汎用プロファイル更新 |

---

## Auth Flow

```
App.jsx
  ↓
supabase.auth.getSession()
  ↓
onAuthStateChange() → session state update
  ↓
GameProvider(session) → fetchProfile() if logged in
```

### New User Trigger
`handle_new_user()` トリガーが `auth.users` INSERT時に自動で `profiles` レコードを作成。

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Anon Key |

---

## Quality Gates
- **Schema変更**: `supabase_schema.sql` を更新し、Supabase SQL Editorで実行
- **RLSテスト**: 各ポリシーが正しくユーザーデータを分離していることを確認
- **エラーハンドリング**: 全Supabase操作で try-catch + `addLog()` でエラー記録

---

## TBD
- [ ] Supabase Edge Functions (将来的なサーバーサイドロジック)
- [ ] Realtime Subscriptions (マルチデバイス同期)
- [ ] Database Migrations (バージョン管理)
