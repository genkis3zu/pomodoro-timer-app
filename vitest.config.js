import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // 単一プロセス実行（メモリ消費抑制）
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,  // 1つのフォークプロセスのみ使用
      },
    },

    // 並列実行無効（メモリ節約）
    fileParallelism: false,

    // 環境設定
    environment: 'jsdom',

    // グローバル設定
    globals: true,

    // セットアップファイル
    setupFiles: ['./src/test/setup.js'],

    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '*.config.js',
      ],
    },

    // タイムアウト設定
    testTimeout: 10000,

    // インクルード/エクスクルード
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
});
