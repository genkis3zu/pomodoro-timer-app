# Claude Code Meta (v1)
目的：助言を実装に落とし、計測で確証し、記録を残す。

原則
1. 指示は MUST → SHOULD → CONSIDER の順で処理
2. 変更は最小コミット、Conventional Commits で記述
3. 計測は数値（例：JS total, LCP, CLS）で報告
4. `docs/PLAN.md`, `docs/CHANGELOG.md`, `docs/SESSION_SUMMARY.md` を更新
5. GitHub push → GitHub push → `.guardrails/config.yaml` に定義されたデプロイ先の完了・ヘルス確認まで監視

出力フォーマット（簡潔）
Intent/What changed:
Diff (files/highlights):
Results (numbers):
Artifacts (branch/sha/deploy URLs):
Risks/TODO:
Questions: