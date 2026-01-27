// GameContext.test.jsx
// ゲームコンテキストの基本テスト

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { GameProvider, useGame } from './GameContext';

// Supabase Mock
vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockReturnThis(),
    })),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
    },
  },
}));

// Cyberware Mock Data
vi.mock('../data/cyberware', () => ({
  CYBERWARE_CATALOG: [
    {
      id: 'theme_default',
      name: 'Standard Issue',
      type: 'theme',
      cost: 0,
      effect: { type: 'visual_theme', value: 'default' }
    },
    {
      id: 'theme_matrix',
      name: 'Construct Matrix',
      type: 'theme',
      cost: 500,
      effect: { type: 'visual_theme', value: 'matrix' }
    },
    {
      id: 'implant_xp_1',
      name: 'Synaptic Accelerator Mk.I',
      type: 'implant',
      cost: 1000,
      effect: { type: 'xp_multiplier', value: 1.1 }
    },
    {
      id: 'implant_overdrive',
      name: 'Cortex Optimizer',
      type: 'implant',
      cost: 5000,
      effect: { type: 'overdrive_credit', value: 5 }
    },
  ],
}));

// Avatar Parts Mock Data
vi.mock('../data/avatars', () => ({
  AVATAR_PARTS: {
    bases: [{ id: 'base_male_1', name: 'Male 1', cost: 0 }],
    backgrounds: [{ id: 'bg_default', name: 'Default', cost: 0 }],
  },
}));

// テスト用ラッパー（sessionなし）
const createWrapper = (session = null) => {
  return ({ children }) => (
    <GameProvider session={session}>
      {children}
    </GameProvider>
  );
};

describe('GameContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初期状態', () => {
    it('未ログイン時の初期状態が正しい', () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      expect(result.current.totalXP).toBe(0);
      expect(result.current.level).toBe(1);
      expect(result.current.credits).toBe(0);
      expect(result.current.inventory).toContain('theme_default');
      expect(result.current.equippedItems.theme).toBe('theme_default');
    });

    it('useGameがGameProvider外で呼ばれるとエラーを投げる', () => {
      expect(() => {
        renderHook(() => useGame());
      }).toThrow('useGame must be used within a GameProvider');
    });
  });

  describe('addLog', () => {
    it('ログが追加される', () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      act(() => {
        result.current.addLog('Test message', 'INFO');
      });

      expect(result.current.systemLogs.length).toBe(1);
      expect(result.current.systemLogs[0].message).toBe('Test message');
      expect(result.current.systemLogs[0].type).toBe('INFO');
    });

    it('ログは最大100件まで保持される', () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      act(() => {
        for (let i = 0; i < 105; i++) {
          result.current.addLog(`Message ${i}`, 'INFO');
        }
      });

      expect(result.current.systemLogs.length).toBe(100);
      // 最新のログが先頭にある
      expect(result.current.systemLogs[0].message).toBe('Message 104');
    });
  });

  describe('activeEffects', () => {
    it('デフォルト状態のactiveEffectsが正しい', () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      expect(result.current.activeEffects).toEqual({
        xpMultiplier: 1,
        visualTheme: 'default',
        audioPack: null,
        overdriveCredit: 0,
      });
    });
  });

  describe('buyItem', () => {
    it('クレジット不足で購入失敗', async () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      let success;
      await act(async () => {
        success = await result.current.buyItem('theme_matrix');
      });

      expect(success).toBe(false);
      expect(result.current.inventory).not.toContain('theme_matrix');
      // ログにWARNINGが追加される
      expect(result.current.systemLogs.some(
        log => log.type === 'WARNING' && log.message.includes('INSUFFICIENT CREDITS')
      )).toBe(true);
    });

    it('既に所有しているアイテムは購入できない', async () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      let success;
      await act(async () => {
        success = await result.current.buyItem('theme_default');
      });

      expect(success).toBe(false);
      expect(result.current.systemLogs.some(
        log => log.type === 'WARNING' && log.message.includes('ALREADY OWN')
      )).toBe(true);
    });

    it('存在しないアイテムは購入できない', async () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      let success;
      await act(async () => {
        success = await result.current.buyItem('nonexistent_item');
      });

      expect(success).toBe(false);
      expect(result.current.systemLogs.some(
        log => log.type === 'ERROR' && log.message.includes('ITEM NOT FOUND')
      )).toBe(true);
    });
  });

  describe('addSession', () => {
    it('XPとクレジットが正しく加算される', async () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      await act(async () => {
        await result.current.addSession('work', 'Test Task', 25);
      });

      expect(result.current.totalXP).toBe(25);
      expect(result.current.credits).toBe(25);
      expect(result.current.history.length).toBe(1);
      expect(result.current.history[0].task).toBe('Test Task');
      expect(result.current.history[0].xp).toBe(25);
    });

    it('レベルが正しく計算される', async () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      // 100XP = Level 2
      await act(async () => {
        await result.current.addSession('work', 'Task 1', 100);
      });

      expect(result.current.level).toBe(2);

      // 追加で100XP = 200 total = Level 3
      await act(async () => {
        await result.current.addSession('work', 'Task 2', 100);
      });

      expect(result.current.level).toBe(3);
    });

    it('セッション完了時にログが追加される', async () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      await act(async () => {
        await result.current.addSession('work', 'Test Task', 25);
      });

      expect(result.current.systemLogs.some(
        log => log.type === 'SUCCESS' && log.message.includes('SESSION COMPLETE')
      )).toBe(true);
    });
  });

  describe('equipItem', () => {
    it('テーマを装備できる', async () => {
      const { result } = renderHook(() => useGame(), {
        wrapper: createWrapper(null)
      });

      await act(async () => {
        await result.current.equipItem('theme_matrix', 'theme');
      });

      expect(result.current.equippedItems.theme).toBe('theme_matrix');
    });
  });
});
