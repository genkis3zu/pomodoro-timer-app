# meta_relay.md
## Context Relay Protocol (v2)

### 目的
ClaudeCode / Codex / Gemini 間でコンテキストが途中で薄まったり消えたりしないように、
各エージェントが **「受け取った文脈を再宣言し、次に明示的に渡す」** ことを義務化する。

---

## 共通フォーマット

### 1. Context Block（各AIの冒頭に必ず付ける）

すべての出力は、先頭にこのブロックを持つ：

```text
[Context Block]
From: <ClaudeCode | Codex | Gemini | Commander>
BasedOn: <何を元にしたか（前の出力・対象ファイルなど）>
Summary: <これまでの経緯を1〜3行で要約>
Objective: <今回のラウンドで達成したい目的を1行で>
```
