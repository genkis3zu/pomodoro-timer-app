# Pomodoro Focus (ポモドーロ・フォーカス)

**Pomodoro Focus** は、生産性を最大化するために設計された、モダンで美しいポモドーロタイマーアプリケーションです。
単なるタイマー機能だけでなく、タスク管理、履歴ログ、そしてモチベーションを維持するためのゲーミフィケーション要素（XPシステム）を備えています。

![Dashboard Screenshot](https://raw.githubusercontent.com/genkis3zu/pomodoro-timer-app/main/screenshot.png)
*(※スクリーンショットはイメージです)*

## ✨ 主な機能

### 1. 没入感のあるタイマー
- **集中モード (25分)** と **休憩モード (5分)** の切り替え。
- **ダイナミックな背景**: モードに合わせて背景色が変化し（集中＝ディープブルー、休憩＝エメラルドグリーン）、視覚的に状態を伝えます。
- **グラスモーフィズムデザイン**: すりガラスのような美しいUIで、作業の邪魔をしません。

### 2. Focus Dashboard (フォーカス・ダッシュボード)
画面右側のダッシュボードで、作業状況を一元管理できます。

- **Focus Level & XP**: ポモドーロを完了するたびにXP（経験値）を獲得。レベルアップすることで達成感を味わえます。
- **Current Objective**: 「今、何に集中しているか」を明文化することで、意識をタスクに向け続けます。
- **Session Log**: 完了したセッションの履歴が自動的に記録されます。

### 3. その他の特徴
- **完全レスポンシブ**: デスクトップでは2カラム、モバイルでは縦積みのレイアウトに自動調整。
- **データ保存**: ブラウザのローカルストレージにデータを保存するため、リロードしても進捗は消えません。
- **通知音**: タイマー終了時にアラーム音でお知らせします。

## 🚀 始め方

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/genkis3zu/pomodoro-timer-app.git

# ディレクトリに移動
cd pomodoro-timer-app

# 依存関係をインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```
ブラウザで `http://localhost:5173` を開いてください。

## 🛠️ 技術スタック

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (v4)
- **Icons**: SVG Icons

## 📝 ライセンス

This project is licensed under the MIT License.
