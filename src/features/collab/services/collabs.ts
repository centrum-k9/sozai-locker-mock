import { CollabEvent, CollabMember } from '../types';

// モックデータ
let collabEventsStore: CollabEvent[] = [
  {
    id: 'collab-1',
    title: '新春コラボ配信',
    description: 'みんなで新年のご挨拶配信をしましょう！',
    scheduledAt: '2024-01-20T14:00:00Z',
    platform: 'YouTube',
    streamUrl: 'https://www.youtube.com/watch?v=example1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    ownerId: 'user-1',
  },
];

let collabMembersStore: CollabMember[] = [
  {
    id: 'member-1',
    collabEventId: 'collab-1',
    friendId: 'friend-1',
    role: 'Guest',
    order: 1,
  },
  {
    id: 'member-2',
    collabEventId: 'collab-1',
    friendId: 'friend-2',
    role: 'Guest',
    order: 2,
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const collabsApi = {
  async listEvents(): Promise<CollabEvent[]> {
    await delay(300);
    return [...collabEventsStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getEvent(id: string): Promise<CollabEvent | null> {
    await delay(200);
    return collabEventsStore.find(event => event.id === id) || null;
  },

  async createEvent(data: Omit<CollabEvent, 'id' | 'createdAt' | 'ownerId'>): Promise<CollabEvent> {
    await delay(500);
    const newEvent: CollabEvent = {
      ...data,
      id: `collab-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ownerId: 'user-1', // モックユーザーID
    };
    collabEventsStore.push(newEvent);
    return newEvent;
  },

  async updateEvent(id: string, data: Partial<CollabEvent>): Promise<CollabEvent | null> {
    await delay(300);
    const index = collabEventsStore.findIndex(event => event.id === id);
    if (index === -1) return null;
    
    collabEventsStore[index] = { 
      ...collabEventsStore[index], 
      ...data, 
      updatedAt: new Date().toISOString() 
    };
    return collabEventsStore[index];
  },

  async deleteEvent(id: string): Promise<boolean> {
    await delay(300);
    const eventIndex = collabEventsStore.findIndex(event => event.id === id);
    if (eventIndex === -1) return false;
    
    // イベントを削除
    collabEventsStore.splice(eventIndex, 1);
    
    // 関連するメンバーも削除
    collabMembersStore = collabMembersStore.filter(
      member => member.collabEventId !== id
    );
    
    return true;
  },

  async getMembers(collabEventId: string): Promise<CollabMember[]> {
    await delay(200);
    return collabMembersStore
      .filter(member => member.collabEventId === collabEventId)
      .sort((a, b) => a.order - b.order);
  },

  async addMember(data: Omit<CollabMember, 'id'>): Promise<CollabMember> {
    await delay(300);
    const newMember: CollabMember = {
      ...data,
      id: `member-${Date.now()}`,
    };
    collabMembersStore.push(newMember);
    return newMember;
  },

  async updateMember(id: string, data: Partial<CollabMember>): Promise<CollabMember | null> {
    await delay(300);
    const index = collabMembersStore.findIndex(member => member.id === id);
    if (index === -1) return null;
    
    collabMembersStore[index] = { ...collabMembersStore[index], ...data };
    return collabMembersStore[index];
  },

  async removeMember(id: string): Promise<boolean> {
    await delay(300);
    const index = collabMembersStore.findIndex(member => member.id === id);
    if (index === -1) return false;
    
    collabMembersStore.splice(index, 1);
    return true;
  },
};