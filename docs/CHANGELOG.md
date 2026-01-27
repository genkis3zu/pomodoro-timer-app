# CHANGELOG

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- docs/ ディレクトリ作成（PLAN.md, CHANGELOG.md, SESSION_SUMMARY.md）
- Vitest テスト環境構築（単一プロセス設定）
- .gitignore 拡充

### Changed
- .guardrails/ 設定をPomodoro Focus用に修正（v2.0）

---

## [1.3.0] - 2024-12-XX

### Added
- アバターカスタマイズ機能
- 背景パーツ（bg_default, bg_neon_city等）
- Cyberware効果システム（effects in cyberware.js）

### Changed
- GameContext: avatarConfig状態追加
- AvatarDisplay: 背景レイヤー対応

---

## [1.2.0] - 2024-11-XX

### Added
- Cyberwareショップ（ShopModal）
- クレジットシステム（XP = Credits）
- Implant装備システム

### Changed
- GameContext: inventory, equippedItems, credits追加

---

## [1.1.0] - 2024-11-XX

### Added
- Supabase認証（Auth.jsx）
- データ永続化（profiles, sessions テーブル）
- Row Level Security (RLS)

---

## [1.0.0] - 2024-11-XX

### Added
- 基本タイマー機能（25分集中/5分休憩）
- Overdrive機能（+10分延長）
- XP/レベルシステム
- セッション履歴
- オーディオ設定
- グラスモーフィズムUI
