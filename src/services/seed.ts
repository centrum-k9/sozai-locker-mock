import { Asset, Collection, ShareLink, User, Category, LicensePreset, FavoriteFolder, DownloadHistory, DownloadNotification } from '@/core/types';

// Mock seed data for VTuber asset management

export const mockAssets: Asset[] = [
  {
    id: '1',
    title: 'メイン立ち絵（通常）',
    description: 'VTuberの基本立ち絵です。配信やコラボ動画でご利用ください。',
    tags: ['基本', '立ち絵', '通常'],
    category: '立ち絵',
    mime: 'image/png',
    size: 2_450_000,
    licensePreset: 'PERSONAL_OK_COMM_NG_CREDIT_REQ',
    creditText: 'イラスト：@artist_name',
    previewUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    isFavorite: true,
    createdAt: '2024-01-15T10:00:00Z',
    ownerId: 'user1',
  },
  {
    id: '2',
    title: 'キービジュアル（春）',
    description: '春をテーマにしたメインビジュアルです。',
    tags: ['春', 'メインビジュアル', 'イベント'],
    category: 'キービジュアル',
    mime: 'image/png',
    size: 3_200_000,
    licensePreset: 'COMM_OK_CREDIT_REQ',
    creditText: 'イラスト：@artist_name',
    previewUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop',
    isFavorite: false,
    createdAt: '2024-01-20T14:30:00Z',
    ownerId: 'user1',
  },
  {
    id: '3',
    title: 'リアル等身イラスト',
    description: 'リアル等身で描かれたイラストです。',
    tags: ['リアル等身', 'フルボディ'],
    category: 'リアル等身',
    mime: 'image/png',
    size: 4_100_000,
    licensePreset: 'COMM_OK_NO_CREDIT',
    previewUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=800&fit=crop',
    isFavorite: true,
    createdAt: '2024-01-25T16:45:00Z',
    ownerId: 'user1',
  },
  {
    id: '4',
    title: 'SDキャラクター',
    description: 'かわいいSDスタイルのキャラクターイラストです。',
    tags: ['SD', 'デフォルメ', 'かわいい'],
    category: 'SDイラスト',
    mime: 'image/png',
    size: 1_800_000,
    licensePreset: 'PERSONAL_OK_COMM_NG_CREDIT_REQ',
    creditText: 'イラスト：@artist_name',
    previewUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop',
    isFavorite: false,
    createdAt: '2024-01-28T11:20:00Z',
    ownerId: 'user1',
  },
  {
    id: '5',
    title: 'ファンアートイラスト',
    description: 'ファンの方からいただいたイラストです。',
    tags: ['ファンアート', 'コミッション'],
    category: 'FA',
    mime: 'image/png',
    size: 2_900_000,
    licensePreset: 'COMM_OK_CREDIT_REQ',
    creditText: 'イラスト：@fan_artist',
    previewUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop',
    isFavorite: true,
    createdAt: '2024-02-01T09:15:00Z',
    ownerId: 'user1',
  },
  // Other users' assets
  {
    id: '6',
    title: '別VTuberの立ち絵',
    description: 'コラボ用の他VTuberの立ち絵',
    tags: ['立ち絵', 'コラボ'],
    category: '立ち絵',
    mime: 'image/png',
    size: 2_300_000,
    licensePreset: 'PERSONAL_OK_COMM_NG_CREDIT_REQ',
    creditText: 'イラスト：@other_artist',
    previewUrl: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=600&fit=crop',
    isFavorite: false,
    createdAt: '2024-01-10T12:00:00Z',
    ownerId: 'user2',
  },
];

export const mockUser: User = {
  id: 'user1',
  email: 'vtuber@example.com',
  name: 'VTuber太郎',
  displayName: 'ばーちゃるたろう',
  avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150&h=150&fit=crop&crop=face',
  mainAvatar: '1', // メイン立ち絵のassetId
  keyVisual: '2', // キービジュアルのassetId
  socialLinks: {
    youtube: 'https://youtube.com/@virtual_taro',
    twitch: 'https://twitch.tv/virtual_taro',
    twitter: 'https://twitter.com/virtual_taro',
    tiktok: 'https://tiktok.com/@virtual_taro',
    discord: 'https://discord.gg/virtual_taro',
  },
  usageRules: 'コラボ配信や切り抜き動画でのご利用はOKです！商用利用の場合は事前にご相談ください。',
  defaultLicense: 'PERSONAL_OK_COMM_NG_CREDIT_REQ',
  defaultCreditText: 'イラスト：@artist_name',
  watermarkText: 'VTuber太郎',
  watermarkOpacity: 30,
  createdAt: '2024-01-01T00:00:00Z',
};

export const mockOtherUsers: User[] = [
  {
    id: 'user2',
    email: 'other@example.com',
    name: 'VTuber花子',
    displayName: 'ばーちゃるはなこ',
    avatar: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=150&h=150&fit=crop&crop=face',
    socialLinks: {
      youtube: 'https://youtube.com/@virtual_hanako',
      twitter: 'https://twitter.com/virtual_hanako',
    },
    usageRules: '個人利用のみOKです。',
    defaultLicense: 'PERSONAL_OK_COMM_NG_CREDIT_REQ',
    defaultCreditText: 'イラスト：@hanako_artist',
    watermarkText: 'VTuber花子',
    watermarkOpacity: 25,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const mockCollections: Collection[] = [
  {
    id: '1',
    title: '基本素材セット',
    description: 'VTuber活動に必要な基本的な素材をまとめました',
    itemIds: ['1', '2'],
    createdAt: '2024-01-15T10:00:00Z',
    ownerId: 'user1',
  },
  {
    id: '2',
    title: 'イベント用素材',
    description: '特別イベント用の素材コレクション',
    itemIds: ['3', '4'],
    createdAt: '2024-01-25T14:30:00Z',
    ownerId: 'user1',
  },
];

export const mockShareLinks: ShareLink[] = [
  {
    id: '1',
    slug: 'main-avatar-share',
    type: 'asset',
    targetId: '1',
    canDownload: true,
    passwordEnabled: false,
    createdAt: '2024-01-15T12:00:00Z',
    ownerId: 'user1',
  },
  {
    id: '2',
    slug: 'basic-set-share',
    type: 'collection',
    targetId: '1',
    canDownload: false,
    passwordEnabled: true,
    password: 'vtuber123',
    expiresAt: '2024-12-31T23:59:59Z',
    createdAt: '2024-01-20T15:30:00Z',
    ownerId: 'user1',
  },
];

export const mockFavoriteFolders: FavoriteFolder[] = [
  {
    id: '1',
    name: 'メイン素材',
    assetIds: ['1', '2'],
    ownerId: 'user1',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'イベント用',
    assetIds: ['3'],
    ownerId: 'user1',
    createdAt: '2024-01-20T14:30:00Z',
  },
];

export const mockDownloadHistory: DownloadHistory[] = [
  {
    id: '1',
    assetId: '6',
    userId: 'user1',
    ownerId: 'user2',
    downloadedAt: '2024-02-01T10:30:00Z',
  },
];

export const mockDownloadNotifications: DownloadNotification[] = [
  {
    id: '1',
    assetId: '1',
    downloaderId: 'user2',
    downloaderName: 'VTuber花子',
    downloadedAt: '2024-02-01T14:20:00Z',
    read: false,
  },
  {
    id: '2',
    assetId: '2',
    downloaderId: 'user3',
    downloaderName: 'ゲスト_123',
    downloadedAt: '2024-01-30T16:45:00Z',
    read: true,
  },
];

export const categoryInfo: Record<Category, { icon: string; color: string }> = {
  '立ち絵': { icon: '🧍', color: 'text-pink-600' },
  'キービジュアル': { icon: '🎨', color: 'text-purple-600' },
  'リアル等身': { icon: '👤', color: 'text-blue-600' },
  'SDイラスト': { icon: '🎭', color: 'text-green-600' },
  'FA': { icon: '💝', color: 'text-orange-600' },
};

export const licensePresetInfo: Record<LicensePreset, { label: string; color: string; description: string }> = {
  'PERSONAL_OK_COMM_NG_CREDIT_REQ': { 
    label: '個人利用OK・商用NG・クレジット必須', 
    color: 'text-yellow-600',
    description: '個人での使用は可能ですが、商用利用は禁止です。使用時はクレジット表記が必要です。'
  },
  'COMM_OK_CREDIT_REQ': { 
    label: '商用利用OK・クレジット必須', 
    color: 'text-green-600',
    description: '商用利用も可能です。使用時はクレジット表記が必要です。'
  },
  'COMM_OK_NO_CREDIT': { 
    label: '商用利用OK・クレジット不要', 
    color: 'text-blue-600',
    description: '商用利用も可能で、クレジット表記も不要です。自由にご利用ください。'
  },
  'CUSTOM': { 
    label: 'カスタム許諾', 
    color: 'text-purple-600',
    description: '個別に設定されたライセンス条件があります。詳細をご確認ください。'
  },
};
