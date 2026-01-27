# Testing Rules (v1.0)

## 目的
テスト実行時のメモリ消費を抑制し、安定した開発環境を維持する。

---

## Vitest 設定ルール

### MUST（必須）
1. **単一プロセス実行**
   - `pool: 'forks'` + `singleFork: true` を維持
   - 並列実行禁止: `fileParallelism: false`

2. **テスト実行コマンド**
   ```bash
   npm run test        # 単発実行（CI用）
   npm run test:watch  # 監視モード（開発用）
   ```

3. **大量テスト時の分割**
   - 50件以上のテストファイルがある場合はディレクトリ単位で分割実行
   ```bash
   npx vitest run src/context/
   npx vitest run src/components/
   ```

### SHOULD（推奨）
1. **テストファイル命名**
   - `*.test.js` または `*.spec.js`
   - コンポーネントと同階層に配置

2. **モック使用**
   - Supabase: `vi.mock('../lib/supabaseClient')`
   - Audio: グローバルモック済み（setup.js）

3. **クリーンアップ**
   - 各テスト後に `cleanup()` 実行（setup.jsで自動）

### CONSIDER（検討）
1. **カバレッジ目標**: 60%以上（初期）
2. **スナップショットテスト**: UI安定後に導入

---

## メモリ監視

### 警告サイン
- テスト実行中にPCが重くなる
- `JavaScript heap out of memory` エラー

### 対処法
1. テストを分割実行
2. `--no-threads` オプション追加
3. Node.js メモリ上限設定:
   ```bash
   NODE_OPTIONS="--max-old-space-size=2048" npm run test
   ```

---

## ディレクトリ構成

```
src/
├── test/
│   └── setup.js           # グローバルセットアップ
├── context/
│   ├── TimerContext.jsx
│   └── TimerContext.test.js
├── components/
│   ├── Timer.jsx
│   └── Timer.test.js
└── hooks/
    ├── useAudioPlayer.js
    └── useAudioPlayer.test.js
```

---

## CI/CD考慮事項

GitHub Actions 等で実行する場合:
```yaml
- name: Run tests
  run: npm run test
  env:
    NODE_OPTIONS: "--max-old-space-size=2048"
```
