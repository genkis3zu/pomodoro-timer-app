# PLAN.md - Pomodoro Focus

## Project Vision
サイバーパンク風ゲーミフィケーション要素を持つモダンなポモドーロタイマーアプリケーション。
生産性向上とモチベーション維持を両立する。

---

## Current Phase
**Phase 3: UI Implementation & Polish**
- UIコンポーネントの洗練とレイアウト構造化
- ユーザー体験の向上

---

## Milestones

### Phase 1: Core Implementation ✅
- [x] タイマー機能（25分/5分）
- [x] XP/レベルシステム
- [x] Supabase認証・データ永続化
- [x] Cyberwareショップ
- [x] アバターカスタマイズ
- [x] Overdrive機能

### Phase 2: Foundation Stabilization ✅
- [x] ガードレール設定（.guardrails/）
- [x] ドキュメント整備（docs/）
- [x] テスト環境構築（Vitest）
- [x] コードカバレッジ60%達成（context/: 69.34%）
- [x] ESLint全エラー解消（0 errors, 2 warnings残 - 技術的負債として管理）

### Phase 3: UI Implementation & Polish 🔄
- [ ] Dashboard Componentポリッシュ
- [ ] Timer View洗練
- [ ] モーダル管理改善
- [ ] レスポンシブ強化
- [ ] Layout.jsx作成（評価後）

### Phase 4: Enhancement (TBD)
- [ ] PWA対応
- [ ] 統計ダッシュボード強化
- [ ] 追加テーマ実装
- [ ] アクセシビリティ改善

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State Management | React Context | 小〜中規模で十分、Redux不要 |
| Styling | Tailwind CSS 4 | Utility-first、高速開発 |
| Backend | Supabase | BaaS、RLS、簡易セットアップ |
| Testing | Vitest | Vite統合、高速、軽量 |
| Test Runner | Single Process | メモリ消費抑制 |

---

## Open Questions
1. PWA対応の優先度
2. マルチデバイス同期（Realtime）の必要性
3. 追加テーマの実装範囲

---

## Technical Debt (Low Priority)

| Warning | File | Impact |
|---------|------|--------|
| Missing dep: `onPreviewChange` | SettingsModal.jsx:18 | Minimal - preview callback |
| Missing deps: `fetchHistory`, `fetchProfile` | GameContext.jsx:48 | Minimal - intentional on-mount only |

**Note:** These warnings are non-blocking and represent acceptable technical debt. The useEffect dependencies are intentionally limited to prevent infinite loops or unnecessary re-fetches.

---

## References
- [Supabase Schema](../supabase_schema.sql)
- [Frontend Architecture](../.guardrails/frontend_system.md)
- [Backend Architecture](../.guardrails/backend_system.md)
