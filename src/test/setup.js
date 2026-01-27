// Vitest Setup File
// テスト環境の初期設定

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 各テスト後にDOMをクリーンアップ
afterEach(() => {
  cleanup();
});

// グローバルモック: matchMedia（Tailwind/レスポンシブ対応）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// グローバルモック: ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// グローバルモック: Audio（オーディオ機能テスト用）
global.Audio = class Audio {
  constructor() {
    this.volume = 1;
    this.src = '';
  }
  play() {
    return Promise.resolve();
  }
  pause() {}
  load() {}
};
