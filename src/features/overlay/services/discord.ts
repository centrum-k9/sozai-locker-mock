import { DiscordLink, DiscordGuild, DiscordChannel, DiscordVoiceMember } from '../types';

// Mock Discord data for development
const mockGuilds: DiscordGuild[] = [
  {
    id: 'guild-1',
    name: 'VTuber配信者サーバー',
    iconUrl: 'https://via.placeholder.com/64x64?text=VT',
  },
  {
    id: 'guild-2', 
    name: 'コラボ企画部',
    iconUrl: 'https://via.placeholder.com/64x64?text=CO',
  },
  {
    id: 'guild-3',
    name: 'ゲーム実況チーム',
    iconUrl: 'https://via.placeholder.com/64x64?text=GA',
  },
];

const mockChannels: DiscordChannel[] = [
  {
    id: 'channel-1',
    guildId: 'guild-1',
    name: 'メイン通話',
    type: 'voice',
  },
  {
    id: 'channel-2',
    guildId: 'guild-1',
    name: 'サブ通話',
    type: 'voice',
  },
  {
    id: 'channel-3',
    guildId: 'guild-1',
    name: 'ステージ配信',
    type: 'stage',
  },
  {
    id: 'channel-4',
    guildId: 'guild-2',
    name: 'コラボ会議',
    type: 'voice',
  },
  {
    id: 'channel-5',
    guildId: 'guild-3',
    name: 'ゲーム通話',
    type: 'voice',
  },
];

const mockVoiceMembers: DiscordVoiceMember[] = [
  {
    id: 'user-1',
    displayName: 'ミクちゃん',
    avatarUrl: 'https://via.placeholder.com/64x64?text=ミク',
    speaking: false,
  },
  {
    id: 'user-2',
    displayName: 'リンちゃん',
    avatarUrl: 'https://via.placeholder.com/64x64?text=リン',
    speaking: true,
  },
  {
    id: 'user-3',
    displayName: 'ルカさん',
    avatarUrl: 'https://via.placeholder.com/64x64?text=ルカ',
    speaking: false,
  },
  {
    id: 'user-4',
    displayName: 'カイト',
    avatarUrl: 'https://via.placeholder.com/64x64?text=カイト',
    speaking: false,
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Discord link status (stored in localStorage for persistence)
const getDiscordLinkFromStorage = (): DiscordLink => {
  try {
    const stored = localStorage.getItem('discord-link');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to parse Discord link from storage:', error);
  }
  return { linked: false };
};

const saveDiscordLinkToStorage = (link: DiscordLink): void => {
  try {
    localStorage.setItem('discord-link', JSON.stringify(link));
  } catch (error) {
    console.warn('Failed to save Discord link to storage:', error);
  }
};

export const discordService = {
  async getLink(): Promise<DiscordLink> {
    await delay(200);
    return getDiscordLinkFromStorage();
  },

  async linkAccount(): Promise<void> {
    await delay(1000);
    const link: DiscordLink = {
      linked: true,
      accountName: 'VTuber#1234',
      linkedAt: new Date().toISOString(),
    };
    saveDiscordLinkToStorage(link);
  },

  async unlinkAccount(): Promise<void> {
    await delay(500);
    saveDiscordLinkToStorage({ linked: false });
  },

  async searchGuilds(query: string = ''): Promise<DiscordGuild[]> {
    await delay(300);
    if (!query.trim()) return mockGuilds;
    
    return mockGuilds.filter(guild => 
      guild.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  async searchChannels(guildId: string, query: string = ''): Promise<DiscordChannel[]> {
    await delay(200);
    let channels = mockChannels.filter(channel => channel.guildId === guildId);
    
    if (query.trim()) {
      channels = channels.filter(channel =>
        channel.name.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Prioritize voice and stage channels
    return channels.sort((a, b) => {
      if (a.type === 'voice' && b.type !== 'voice') return -1;
      if (b.type === 'voice' && a.type !== 'voice') return 1;
      if (a.type === 'stage' && b.type !== 'stage') return -1;
      if (b.type === 'stage' && a.type !== 'stage') return 1;
      return 0;
    });
  },

  async listVoiceMembers(channelId: string): Promise<DiscordVoiceMember[]> {
    await delay(400);
    // Mock: return random subset of users
    const shuffled = [...mockVoiceMembers].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 members
    return shuffled.slice(0, count);
  },

  // Mock speaking state toggle (for development)
  async toggleSpeaking(userId: string): Promise<void> {
    await delay(100);
    const member = mockVoiceMembers.find(m => m.id === userId);
    if (member) {
      member.speaking = !member.speaking;
    }
  },
};