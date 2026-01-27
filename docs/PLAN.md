# PLAN.md - Pomodoro Focus

## Project Vision
サイバーパンク風ゲーミフィケーション要素を持つモダンなポモドーロタイマーアプリケーション。
生産性向上とモチベーション維持を両立する。

---

## Current Phase
**Phase 2: Foundation Stabilization**
- 開発基盤の整備（ガードレール、ドキュメント、テスト環境）
- コード品質の確保

---

## Milestones

### Phase 1: Core Implementation ✅
- [x] タイマー機能（25分/5分）
- [x] XP/レベルシステム
- [x] Supabase認証・データ永続化
- [x] Cyberwareショップ
- [x] アバターカスタマイズ
- [x] Overdrive機能

### Phase 2: Foundation Stabilization 🔄
- [x] ガードレール設定（.guardrails/）
- [x] ドキュメント整備（docs/）
- [ ] テスト環境構築（Vitest）
- [ ] コードカバレッジ測定

### Phase 3: Enhancement (TBD)
- [ ] PWA対応
- [ ] 統計ダッシュボード
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

## References
- [Supabase Schema](../supabase_schema.sql)
- [Frontend Architecture](../.guardrails/frontend_system.md)
- [Backend Architecture](../.guardrails/backend_system.md)
