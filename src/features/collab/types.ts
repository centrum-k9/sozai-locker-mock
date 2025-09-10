export type Friend = {
  id: string;
  displayName: string;
  xHandle?: string; // 保存時は@なし
  youtubeUrl?: string;
  twitchUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  defaultStandingAssetId?: string;
  defaultKeyVisualAssetId?: string;
  createdAt: string;
};

export type CollabEvent = {
  id: string;
  title: string;
  description?: string;
  scheduledAt?: string;
  platform?: 'YouTube' | 'Twitch' | 'Niconico' | 'Other';
  streamUrl?: string;
  createdAt: string;
  updatedAt?: string;
  ownerId: string;
};

export type CollabMember = {
  id: string;
  collabEventId: string;
  friendId: string;
  overrideStandingAssetId?: string;
  overrideKeyVisualAssetId?: string;
  role?: 'Main' | 'Guest';
  order: number;
};

export type Plan = 'FREE' | 'PAID';

export type Quota = {
  assetMax: number; // 初期5、SNS特典で10、有料∞
  collabMax: number; // 初期5、招待で最大8、有料∞
};

export type IncentiveStatus = {
  snsBoostGranted: boolean;
  invitesGranted: number; // 上限3
};

export type TextPattern = 'overview' | 'announcement-a' | 'announcement-b';

// 便利関数
export const toXMention = (handle?: string) => (handle ? `@${handle}` : '');
export const toXHashtag = (handle?: string) => (handle ? `#${handle}` : '');
export const toXUrl = (handle?: string) =>
  handle ? `https://x.com/${handle}` : undefined;

export const removeAtSymbol = (handle?: string) => 
  handle ? handle.replace(/^@/, '') : undefined;

// プラン関連のヘルパー
export const getQuotaForPlan = (
  plan: Plan, 
  incentiveStatus: IncentiveStatus
): Quota => {
  if (plan === 'PAID') {
    return { assetMax: Infinity, collabMax: Infinity };
  }
  
  const baseAssetMax = incentiveStatus.snsBoostGranted ? 10 : 5;
  const baseCollabMax = 5 + incentiveStatus.invitesGranted;
  
  return { assetMax: baseAssetMax, collabMax: baseCollabMax };
};