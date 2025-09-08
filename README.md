# SozaiLocker MVP - VTuber素材管理プラットフォーム

VTuber・クリエイター向けの素材管理プラットフォーム「SozaiLocker」のフロントエンドMVPです。

## 🎯 プロジェクト概要

このMVPは**UI/UXの流れ確認とユーザーテスト**を目的としており、**モックサービス/フェイクデータ**で動作します。実際のバックエンドAPIは後工程で実装差し替えが可能な構造になっています。

## 🚀 クイックスタート

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

## 📱 主要機能

### 認証・ユーザー管理
- Googleログイン風のモックログイン
- ユーザープロフィール管理
- 透かし設定

### 素材管理
- ドラッグ&ドロップアップロード（モック）
- 素材一覧（検索・フィルタ・ソート）
- メタデータ編集
- ライセンス管理

### コレクション機能
- 素材のグループ化
- ドラッグ&ドロップでの並び替え

### 共有機能
- パスワード保護付き共有リンク
- 有効期限設定
- ダウンロード履歴（モック）
- 透かし付きプレビュー

### その他
- レスポンシブデザイン
- ダーク/ライトモード対応
- アナリティクス（スタブ）

## 🏗️ アーキテクチャ

### 技術スタック
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State**: React Query + React Context
- **Routing**: React Router v6

### ディレクトリ構造
```
src/
├── components/          # UI コンポーネント
│   ├── ui/             # shadcn/ui コンポーネント
│   ├── layout/         # レイアウトコンポーネント
│   └── modals/         # モーダルコンポーネント
├── core/               # ドメインモデル・型定義
├── hooks/              # カスタムフック
├── pages/              # ページコンポーネント
├── services/           # モックAPI層
└── lib/                # ユーティリティ
```

### 依存分離設計
- `/core`: 型・ドメインロジック
- `/services`: モックAPI層（実装差し替え対象）
- UI層は`services`経由でのみデータアクセス

## 🔄 実装差し替えガイド

MVPから本番環境への移行手順：

### 1. モックAPI の差し替え
```bash
# 現在のモックファイル
src/services/mockClient.ts  →  src/services/httpClient.ts

# 環境変数追加
echo "VITE_API_BASE_URL=https://api.sozailocker.com" >> .env
```

### 2. 認証システムの実装
```typescript
// src/hooks/useAuth.tsx の内容を実装に差し替え
import { useSupabaseAuth } from '@supabase/auth-helpers-react';
// または NextAuth, Auth0 など
```

### 3. ファイルアップロード
```typescript
// src/services/uploadApi.ts
// 実際のS3, Cloudinary, Supabase Storage などに差し替え
```

### 4. データベース接続
`/services/mockClient.ts` の各API関数を実際のHTTPクライアントに置換：

```typescript
// Before (Mock)
export const assetApi = {
  async list() { return mockAssets; }
};

// After (Real API)
export const assetApi = {
  async list() { 
    return httpClient.get('/api/assets');
  }
};
```

## 📋 API契約書

将来の実装用OpenAPI仕様は `contracts/openapi.yaml` に定義済み。

主要エンドポイント：
- `POST /api/assets` - 素材作成
- `GET /api/assets` - 素材一覧
- `GET /api/assets/{id}` - 素材詳細
- `POST /api/share` - 共有リンク作成
- `GET /api/share/{slug}` - 共有ページ取得

## 🎨 デザインシステム

### カラーパレット
- Primary: バイオレット系（262, 83%, 58%）
- Secondary: ソフトラベンダー
- Accent: クリエイティブピンク

### コンポーネント
- カードグラデーション
- 透かしエフェクト
- スムーズアニメーション
- レスポンシブグリッド

## 🧪 テスト・デバッグ

### モックデータ
VTuberユースケースを想定したサンプルデータ：
- 立ち絵、サムネイル素材、BGM、効果音
- 3種類のライセンス設定
- 共有リンクのデモ

### アナリティクス
開発者コンソールでイベント確認可能：
```javascript
// ブラウザコンソールで確認
localStorage.getItem('analytics-events');
```

## 🚀 本番デプロイ

1. ビルド: `npm run build`
2. 静的ファイルを任意のホスティングサービスへ
3. 環境変数で実APIエンドポイントを設定

## 📄 ライセンス

MIT License

---

**SozaiLocker MVP** - VTuberクリエイターのための素材管理を、もっとスマートに。