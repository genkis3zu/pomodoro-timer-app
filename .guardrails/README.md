# 🧭 Guardrail System Policy (v2.0)

## 目的
このディレクトリは、AIエージェント（Commander / ClaudeCode / Codex）が安定して高品質な開発運用を行うための
行動原則・出力基準・検証手順を明文化したガードレール群を管理するものです。

**対象プロジェクト**: Pomodoro Focus（サイバーパンク風ポモドーロタイマー）

---

## 構成

| ファイル | 目的 |
|----------|------|
| `role.md` | エージェント定義（Commander/ClaudeCode/Codex）※唯一のロール定義 |
| `codex_meta.md` | 監査・レビュー側のルール |
| `claude_meta.md` | 実装・検証・報告側のルール |
| `gemini_meta.md` | 対話型助言側のルール |
| `meta_relay.md` | コンテキスト引き継ぎプロトコル |
| `checklist.md` | 各タスクでAIが再読すべきチェックリスト |
| `backend_system.md` | Supabaseバックエンドアーキテクチャ |
| `frontend_system.md` | React/Vite/Tailwindフロントエンドアーキテクチャ |
| `glossary.md` | 用語・命名規約（AIの誤解防止用） |
| `confg.yaml` | パス・閾値・コマンド設定 |
| `metrics.yaml` | メトリクス定義 |
| `testing_rules.md` | テスト実行ルール（メモリ制限） |
| `README.md` | 本運用ポリシー |

---

## Tech Stack Reference

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7, Tailwind CSS 4 |
| Backend | Supabase (PostgreSQL + Auth) |
| State | React Context API |
| Linting | ESLint 9 (Flat Config) |

---

## 運用手順

### 1. 新しいルールを追加・変更する場合
1. `feature/guardrail-update-*` ブランチを作成。
2. 該当ファイルを編集。
3. PR タイトル: `docs(guardrail): update <file> vX.Y`
4. Codex または人間レビューアが確認。
5. 承認後、`main` にマージ。

### 2. AIがルールを破った場合
1. ClaudeCode が実行ミス・省略をした際は、`SESSION_SUMMARY.md` に記録。
2. Codex は次回助言時に `.guardrails/checklist.md` の該当項目を明示的に再読させる。
3. 再発防止が必要な場合はルール改訂の提案を出し、PR化。

### 3. 定期レビュー
- **頻度**: 毎月またはフェーズ区切りごとに1回
- **目的**: checklist の過剰化/形骸化を防ぐ

### 4. ルールのバージョン管理
- すべてのガードレールファイルは Git で管理
- コミットメッセージは `docs(guardrail): <内容>` に統一
- 各metaファイルの先頭に `# version:` を明記

---

## ファイル参照順

```
ClaudeCode 起動時:
1. role.md → 自身の役割確認
2. claude_meta.md → 出力フォーマット確認
3. checklist.md → タスク前チェック
4. frontend_system.md / backend_system.md → 技術コンテキスト
5. meta_relay.md → 引き継ぎプロトコル

Codex 起動時:
1. role.md → 自身の役割確認
2. codex_meta.md → 評価基準確認
3. checklist.md → レビュー観点
```

---

## 運用の理念
> 「ルールは縛りではなく、再現性のための構造である」

ガードレールはAIの自由を奪うものではなく、**品質と再現性を保ったまま進化するための足場**です。
