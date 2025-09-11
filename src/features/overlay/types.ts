export type DiscordLink = {
  linked: boolean;
  accountName?: string;
  linkedAt?: string;
};

export type DiscordGuild = {
  id: string;
  name: string;
  iconUrl?: string;
};

export type DiscordChannel = {
  id: string;
  guildId: string;
  name: string;
  type: 'voice' | 'stage' | 'other';
};

export type DiscordVoiceMember = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  speaking?: boolean;
};

export type OverlayLayout = 'grid' | 'list';
export type OverlayMode = 'aggregate' | 'individual';

export type OverlayAppearance = {
  showName: boolean;
  showAvatar: boolean;
  showStandingImage: boolean;
  background: 'transparent' | 'solid';
  solidColor?: string;
  cornerRadius: number;
  gap: number;
  nameStyle: 'plain' | 'shadow' | 'stroke';
  highlightSpeaking: boolean;
  bounceOnSpeaking?: boolean;
};

export type OverlayConfig = {
  id: string;
  collabId: string;
  mode: OverlayMode;
  layout: OverlayLayout;
  guildId?: string;
  channelId?: string;
  memberIds?: string[];
  appearance: OverlayAppearance;
  perUser?: {
    [userId: string]: OverlayAppearance;
  };
  createdAt: string;
  updatedAt?: string;
};

export type OverlaySource = {
  html: string;
  downloadFileName: string;
  hostedUrl?: string;
};

// Default appearance settings
export const defaultAppearance: OverlayAppearance = {
  showName: true,
  showAvatar: true,
  showStandingImage: true,
  background: 'transparent',
  solidColor: '#000000',
  cornerRadius: 8,
  gap: 16,
  nameStyle: 'shadow',
  highlightSpeaking: true,
  bounceOnSpeaking: false,
};