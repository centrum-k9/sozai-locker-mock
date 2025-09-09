export type LicensePreset =
  | 'PERSONAL_OK_COMM_NG_CREDIT_REQ'
  | 'COMM_OK_CREDIT_REQ'
  | 'COMM_OK_NO_CREDIT'
  | 'CUSTOM';

export type Asset = {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  category: Category;
  mime: string;
  size: number; // bytes
  licensePreset: LicensePreset;
  creditText?: string;
  previewUrl?: string;   // モックURL
  originalUrl?: string;  // 常にundefined（モック段階）
  isFavorite?: boolean;
  createdAt: string;
  ownerId: string;
};

export type Collection = {
  id: string;
  title: string;
  description?: string;
  itemIds: string[];
  createdAt: string;
  ownerId: string;
};

export type ShareLink = {
  id: string;
  slug: string;
  type: 'asset' | 'collection';
  targetId: string;
  canDownload: boolean;
  passwordEnabled: boolean;
  password?: string;
  expiresAt?: string;
  createdAt: string;
  ownerId: string;
};

export type DownloadLog = {
  id: string;
  shareLinkId: string;
  actorLabel?: string; // 未ログイン利用者は "guest-xxxx"
  ipMasked?: string;
  userAgent?: string;
  at: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  displayName?: string; // 活動名
  avatar?: string;
  mainAvatar?: string; // メイン立ち絵のassetId
  keyVisual?: string; // キービジュアルのassetId
  socialLinks?: {
    youtube?: string;
    twitch?: string;
    twitter?: string;
    tiktok?: string;
    discord?: string;
  };
  usageRules?: string; // 素材利用時のルール
  defaultLicense: LicensePreset;
  defaultCreditText?: string;
  watermarkText?: string;
  watermarkOpacity?: number;
  createdAt: string;
};

export type FavoriteFolder = {
  id: string;
  name: string;
  assetIds: string[];
  ownerId: string;
  createdAt: string;
};

export type Friend = {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};

export type DownloadHistory = {
  id: string;
  assetId: string;
  userId: string;
  ownerId: string;
  downloadedAt: string;
};

export type DownloadNotification = {
  id: string;
  assetId: string;
  downloaderId: string;
  downloaderName: string;
  downloadedAt: string;
  read: boolean;
};

export type Category = 
  | '立ち絵'
  | 'キービジュアル'
  | 'リアル等身'
  | 'SDイラスト'
  | 'FA';

export type ViewMode = 'card' | 'table';

export type SortOption = 
  | 'created-desc'
  | 'created-asc'
  | 'title-asc'
  | 'title-desc'
  | 'size-desc'
  | 'size-asc';

export type FilterOptions = {
  category?: Category;
  license?: LicensePreset;
  tags?: string[];
  search?: string;
  ownerId?: string;
};

export type PaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ListResponse<T> = {
  items: T[];
  pagination: PaginationInfo;
};

// Analytics event types
export type AnalyticsEvent = 
  | { type: 'page_view'; page: string; }
  | { type: 'click'; element: string; location: string; }
  | { type: 'upload_start'; assetCount: number; }
  | { type: 'upload_complete'; assetId: string; }
  | { type: 'share_created'; shareType: 'asset' | 'collection'; targetId: string; }
  | { type: 'download'; shareSlug: string; }
  | { type: 'settings_change'; setting: string; value: any; };