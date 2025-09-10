import { Friend } from '../types';

// モックデータ
let friendsStore: Friend[] = [
  {
    id: 'friend-1',
    displayName: 'ミクちゃん',
    xHandle: 'miku_vtube',
    youtubeUrl: 'https://www.youtube.com/@mikuvtube',
    twitchUrl: 'https://www.twitch.tv/mikuvtube',
    defaultStandingAssetId: 'asset-3',
    defaultKeyVisualAssetId: 'asset-5',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'friend-2',
    displayName: 'リンちゃん',
    xHandle: 'rin_streaming',
    youtubeUrl: 'https://www.youtube.com/@rinstreaming',
    defaultStandingAssetId: 'asset-4',
    createdAt: '2024-01-15T00:00:00Z',
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const friendsApi = {
  async list(): Promise<Friend[]> {
    await delay(300);
    return [...friendsStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async get(id: string): Promise<Friend | null> {
    await delay(200);
    return friendsStore.find(friend => friend.id === id) || null;
  },

  async create(data: Omit<Friend, 'id' | 'createdAt'>): Promise<Friend> {
    await delay(500);
    const newFriend: Friend = {
      ...data,
      id: `friend-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    friendsStore.push(newFriend);
    return newFriend;
  },

  async update(id: string, data: Partial<Friend>): Promise<Friend | null> {
    await delay(300);
    const index = friendsStore.findIndex(friend => friend.id === id);
    if (index === -1) return null;
    
    friendsStore[index] = { ...friendsStore[index], ...data };
    return friendsStore[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const index = friendsStore.findIndex(friend => friend.id === id);
    if (index === -1) return false;
    
    friendsStore.splice(index, 1);
    return true;
  },
};