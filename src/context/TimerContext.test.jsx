// TimerContext.test.js
// タイマーコンテキストの基本テスト

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { TimerProvider, useTimer } from './TimerContext';

// テスト用ラッパー
const wrapper = ({ children }) => (
  <TimerProvider onTimerComplete={vi.fn()} onLog={vi.fn()}>
    {children}
  </TimerProvider>
);

describe('TimerContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('初期状態が正しい', () => {
    const { result } = renderHook(() => useTimer(), { wrapper });

    expect(result.current.mode).toBe('work');
    expect(result.current.timeLeft).toBe(25 * 60); // 25分
    expect(result.current.isActive).toBe(false);
    expect(result.current.overdriveActive).toBe(false);
  });

  it('toggleTimer でタイマーが開始/停止する', () => {
    const { result } = renderHook(() => useTimer(), { wrapper });

    // 開始
    act(() => {
      result.current.toggleTimer();
    });
    expect(result.current.isActive).toBe(true);

    // 停止
    act(() => {
      result.current.toggleTimer();
    });
    expect(result.current.isActive).toBe(false);
  });

  it('resetTimer でタイマーがリセットされる', () => {
    const { result } = renderHook(() => useTimer(), { wrapper });

    // タイマー開始して少し進める
    act(() => {
      result.current.toggleTimer();
    });
    act(() => {
      vi.advanceTimersByTime(5000); // 5秒進める
    });

    // リセット
    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.timeLeft).toBe(25 * 60);
    expect(result.current.isActive).toBe(false);
  });

  it('switchMode でモードが切り替わる', () => {
    const { result } = renderHook(() => useTimer(), { wrapper });

    act(() => {
      result.current.switchMode('break');
    });

    expect(result.current.mode).toBe('break');
    expect(result.current.timeLeft).toBe(5 * 60); // 5分
  });
});
