import { Asset, Collection, ShareLink, DownloadLog, User } from '@/core/types';

// Mock user data
export const mockUser: User = {
  id: 'user-1',
  email: 'creator@example.com',
  name: 'VTuberクリエイター',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator',
  defaultLicense: 'COMM_OK_CREDIT_REQ',
  defaultCreditText: '@VTuberクリエイター',
  watermarkText: 'SozaiLocker Sample',
  watermarkOpacity: 0.3,
  createdAt: '2024-01-01T00:00:00Z',
};

// Mock assets with VTuber use cases
export const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    title: 'メインキャラ立ち絵 - 通常衣装',
    description: 'VTuberメインキャラクターの基本立ち絵です。配信やサムネイルに使用可能。',
    tags: ['立ち絵', 'メインキャラ', '通常衣装', 'PNG'],
    category: '立ち絵',
    mime: 'image/png',
    size: 2048000, // 2MB
    licensePreset: 'PERSONAL_OK_COMM_NG_CREDIT_REQ',
    creditText: '@VTuberクリエイター',
    previewUrl: 'https://picsum.photos/400/600?random=1',
    createdAt: '2024-12-01T10:00:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'asset-2',
    title: 'ゲーム実況用サムネイルテンプレート',
    description: 'ゲーム実況動画用のサムネイルテンプレート。文字入れ可能な余白付き。',
    tags: ['サムネイル', 'ゲーム実況', 'テンプレート', 'PSD'],
    category: 'サムネ素材',
    mime: 'image/psd',
    size: 15728640, // 15MB
    licensePreset: 'COMM_OK_CREDIT_REQ',
    creditText: 'サムネ素材 by @VTuberクリエイター',
    previewUrl: 'https://picsum.photos/800/450?random=2',
    createdAt: '2024-12-02T14:30:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'asset-3',
    title: 'チャンネルロゴ - メインバージョン',
    description: 'チャンネル用のメインロゴです。透明背景PNG形式。',
    tags: ['ロゴ', 'チャンネル', '透明背景', 'ブランディング'],
    category: 'ロゴ',
    mime: 'image/png',
    size: 512000, // 512KB
    licensePreset: 'COMM_OK_NO_CREDIT',
    previewUrl: 'https://picsum.photos/400/400?random=3',
    createdAt: '2024-12-03T09:15:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'asset-4',
    title: 'アンビエントBGM - 作業用',
    description: '配信のバックグラウンドに最適な落ち着いたアンビエント音楽。',
    tags: ['BGM', 'アンビエント', '作業用', 'ループ可能'],
    category: 'BGM',
    mime: 'audio/wav',
    size: 45000000, // 45MB
    licensePreset: 'PERSONAL_OK_COMM_NG_CREDIT_REQ',
    creditText: 'BGM: @VTuberクリエイター',
    previewUrl: 'https://picsum.photos/400/300?random=4',
    createdAt: '2024-12-04T16:45:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'asset-5',
    title: '通知音効果音セット',
    description: 'チャット通知、フォロー通知など配信で使える効果音のセット。',
    tags: ['SE', '通知音', 'セット', 'OBS'],
    category: 'SE',
    mime: 'audio/wav',
    size: 5000000, // 5MB
    licensePreset: 'COMM_OK_CREDIT_REQ',
    creditText: 'SE by @VTuberクリエイター',
    previewUrl: 'https://picsum.photos/400/300?random=5',
    createdAt: '2024-12-05T11:20:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'asset-6',
    title: 'エモート用イラスト - 喜び',
    description: 'Twitchエモートやディスコード用の感情表現イラスト。',
    tags: ['エモート', 'イラスト', '感情', 'Twitch'],
    category: 'イラスト',
    mime: 'image/png',
    size: 256000, // 256KB
    licensePreset: 'COMM_OK_NO_CREDIT',
    previewUrl: 'https://picsum.photos/200/200?random=6',
    createdAt: '2024-12-06T13:10:00Z',
    ownerId: 'user-1',
  },
];

// Mock collections
export const mockCollections: Collection[] = [
  {
    id: 'collection-1',
    title: 'メインキャラ素材パック',
    description: 'メインキャラクターに関連する全ての素材をまとめたコレクション',
    itemIds: ['asset-1', 'asset-6'],
    createdAt: '2024-12-01T12:00:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'collection-2',
    title: '配信用音声素材',
    description: '配信で使用する音楽・効果音のコレクション',
    itemIds: ['asset-4', 'asset-5'],
    createdAt: '2024-12-04T18:00:00Z',
    ownerId: 'user-1',
  },
];

// Mock share links
export const mockShareLinks: ShareLink[] = [
  {
    id: 'share-1',
    slug: 'main-character-pack',
    type: 'collection',
    targetId: 'collection-1',
    canDownload: true,
    passwordEnabled: false,
    createdAt: '2024-12-07T10:00:00Z',
    ownerId: 'user-1',
  },
  {
    id: 'share-2',
    slug: 'gaming-thumbnail',
    type: 'asset',
    targetId: 'asset-2',
    canDownload: false,
    passwordEnabled: true,
    password: 'preview123',
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-12-07T15:30:00Z',
    ownerId: 'user-1',
  },
];

// Mock download logs
export const mockDownloadLogs: DownloadLog[] = [
  {
    id: 'log-1',
    shareLinkId: 'share-1',
    actorLabel: 'guest-abc123',
    ipMasked: '192.168.1.***',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    at: '2024-12-08T14:22:00Z',
  },
  {
    id: 'log-2',
    shareLinkId: 'share-1',
    actorLabel: 'user@example.com',
    ipMasked: '10.0.0.***',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    at: '2024-12-08T16:45:00Z',
  },
];

// License preset display information
export const licensePresetInfo = {
  'PERSONAL_OK_COMM_NG_CREDIT_REQ': {
    label: '個人利用OK・商用NG・クレジット必須',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    description: '個人での使用は可能ですが、商用利用は禁止です。使用時はクレジット表記が必要です。',
  },
  'COMM_OK_CREDIT_REQ': {
    label: '商用利用OK・クレジット必須',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    description: '商用利用も可能です。使用時はクレジット表記が必要です。',
  },
  'COMM_OK_NO_CREDIT': {
    label: '商用利用OK・クレジット不要',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    description: '商用利用も可能で、クレジット表記も不要です。自由にご利用ください。',
  },
  'CUSTOM': {
    label: 'カスタムライセンス',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    description: '個別に設定されたライセンス条件があります。詳細をご確認ください。',
  },
};

// Category information
export const categoryInfo = {
  '立ち絵': { icon: '🎭', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' },
  'サムネ素材': { icon: '🖼️', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  'ロゴ': { icon: '🎨', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
  'BGM': { icon: '🎵', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  'SE': { icon: '🔊', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  'イラスト': { icon: '🎨', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' },
  'その他': { icon: '📁', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
};