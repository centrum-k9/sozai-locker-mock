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
  category?: string;
  mime: string;
  size: number; // bytes
  licensePreset: LicensePreset;
  creditText?: string;
  previewUrl?: string;   // モックURL
  originalUrl?: string;  // 常にundefined（モック段階）
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
  avatar?: string;
  defaultLicense: LicensePreset;
  defaultCreditText?: string;
  watermarkText?: string;
  watermarkOpacity?: number;
  createdAt: string;
};

export type Category = 
  | '立ち絵'
  | 'サムネ素材'
  | 'ロゴ'
  | 'BGM'
  | 'SE'
  | 'イラスト'
  | 'その他';

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