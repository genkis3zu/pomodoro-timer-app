# Glossary / Naming Rules

## Git・ブランチ規約
- main ブランチ: `main` 固定
- commit 規約: Conventional Commits（feat/fix/perf/chore/docs/refactor/test）
- ブランチ命名: `feature/xxx`, `fix/xxx`, `refactor/xxx`, `docs/xxx`

## デプロイ・インフラ
- ホスティング: Vercel（予定）
- BaaS: Supabase
- 環境変数プレフィックス: `VITE_`

## ドキュメント
- `docs/PLAN.md` - 計画・目標
- `docs/CHANGELOG.md` - 変更履歴
- `docs/SESSION_SUMMARY.md` - セッション記録

## メトリクス略称
- LCP: Largest Contentful Paint
- CLS: Cumulative Layout Shift
- TTFB: Time to First Byte
- XP: Experience Points（ゲーム内経験値）

## プロジェクト固有用語

| 用語 | 説明 |
|------|------|
| Overdrive | ポモドーロ終了後の+10分延長モード |
| Cyberware | ショップで購入可能なアイテム（テーマ/オーディオ/インプラント） |
| Credits | ゲーム内通貨（XPと1:1で獲得） |
| Implant | パッシブ効果を持つCyberware（XP倍率など） |
| Jack Out | セッション終了（Overdriveを選ばない） |
| activeEffects | 装備中アイテムから計算される効果（xpMultiplier等） |

## Context命名
- `TimerContext` - タイマー状態管理
- `GameContext` - ゲーム状態管理（XP, インベントリ, 履歴）

## Supabaseテーブル
- `profiles` - ユーザープロファイル（XP, レベル, 所持品）
- `sessions` - ポモドーロセッション履歴

## PRラベル例
- `feat` - 新機能
- `fix` - バグ修正
- `perf` - パフォーマンス改善
- `docs` - ドキュメント
- `guardrail` - ガードレール更新
- `hotfix` - 緊急修正
