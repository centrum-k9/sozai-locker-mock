import { 
  Asset, 
  Collection, 
  ShareLink, 
  DownloadLog, 
  User, 
  ListResponse, 
  FilterOptions, 
  SortOption,
  PaginationInfo,
  FavoriteFolder,
  DownloadHistory,
  DownloadNotification 
} from '@/core/types';
import { 
  mockAssets, 
  mockCollections, 
  mockShareLinks, 
  mockUser,
  mockOtherUsers,
  mockFavoriteFolders,
  mockDownloadHistory,
  mockDownloadNotifications
} from './seed';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (mock database)
let assetsStore = [...mockAssets];
let collectionsStore = [...mockCollections];
let shareLinksStore = [...mockShareLinks];
let userStore = { ...mockUser };
let usersStore = [mockUser, ...mockOtherUsers];
let favoriteFoldersStore = [...mockFavoriteFolders];
let downloadHistoryStore = [...mockDownloadHistory];
let downloadNotificationsStore = [...mockDownloadNotifications];

// Helper function to apply filters and sorting
function applyFiltersAndSort(
  items: Asset[], 
  filters: FilterOptions = {}, 
  sort: SortOption = 'created-desc'
): Asset[] {
  let filtered = [...items];

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  if (filters.category) {
    filtered = filtered.filter(item => item.category === filters.category);
  }

  if (filters.license) {
    filtered = filtered.filter(item => item.licensePreset === filters.license);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(item => 
      filters.tags!.some(tag => item.tags.includes(tag))
    );
  }

  // Apply sorting
  switch (sort) {
    case 'created-desc':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'created-asc':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'title-asc':
      filtered.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title-desc':
      filtered.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'size-desc':
      filtered.sort((a, b) => b.size - a.size);
      break;
    case 'size-asc':
      filtered.sort((a, b) => a.size - b.size);
      break;
  }

  return filtered;
}

// Helper function for pagination
function paginate<T>(items: T[], page: number, limit: number): ListResponse<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

// Asset API
export const assetApi = {
  async list(
    page: number = 1, 
    limit: number = 12, 
    filters: FilterOptions = {}, 
    sort: SortOption = 'created-desc'
  ): Promise<ListResponse<Asset>> {
    await delay(300);
    const filtered = applyFiltersAndSort(assetsStore, filters, sort);
    return paginate(filtered, page, limit);
  },

  async get(id: string): Promise<Asset | null> {
    await delay(200);
    return assetsStore.find(asset => asset.id === id) || null;
  },

  async create(data: Omit<Asset, 'id' | 'createdAt' | 'ownerId'>): Promise<Asset> {
    await delay(500);
    const newAsset: Asset = {
      ...data,
      id: `asset-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ownerId: userStore.id,
    };
    assetsStore.push(newAsset);
    return newAsset;
  },

  async update(id: string, data: Partial<Asset>): Promise<Asset | null> {
    await delay(300);
    const index = assetsStore.findIndex(asset => asset.id === id);
    if (index === -1) return null;
    
    assetsStore[index] = { ...assetsStore[index], ...data };
    return assetsStore[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const index = assetsStore.findIndex(asset => asset.id === id);
    if (index === -1) return false;
    
    assetsStore.splice(index, 1);
    return true;
  },
};

// Collection API
export const collectionApi = {
  async list(page: number = 1, limit: number = 12): Promise<ListResponse<Collection>> {
    await delay(300);
    const sorted = [...collectionsStore].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return paginate(sorted, page, limit);
  },

  async get(id: string): Promise<Collection | null> {
    await delay(200);
    return collectionsStore.find(collection => collection.id === id) || null;
  },

  async create(data: Omit<Collection, 'id' | 'createdAt' | 'ownerId'>): Promise<Collection> {
    await delay(500);
    const newCollection: Collection = {
      ...data,
      id: `collection-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ownerId: userStore.id,
    };
    collectionsStore.push(newCollection);
    return newCollection;
  },

  async update(id: string, data: Partial<Collection>): Promise<Collection | null> {
    await delay(300);
    const index = collectionsStore.findIndex(collection => collection.id === id);
    if (index === -1) return null;
    
    collectionsStore[index] = { ...collectionsStore[index], ...data };
    return collectionsStore[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const index = collectionsStore.findIndex(collection => collection.id === id);
    if (index === -1) return false;
    
    collectionsStore.splice(index, 1);
    return true;
  },

  async getAssets(id: string): Promise<Asset[]> {
    await delay(200);
    const collection = collectionsStore.find(c => c.id === id);
    if (!collection) return [];
    
    return assetsStore.filter(asset => collection.itemIds.includes(asset.id));
  },
};

// Share Link API
export const shareApi = {
  async create(data: Omit<ShareLink, 'id' | 'slug' | 'createdAt' | 'ownerId'>): Promise<ShareLink> {
    await delay(400);
    const slug = `${data.type}-${Math.random().toString(36).substring(2, 8)}`;
    const newShareLink: ShareLink = {
      ...data,
      id: `share-${Date.now()}`,
      slug,
      createdAt: new Date().toISOString(),
      ownerId: userStore.id,
    };
    shareLinksStore.push(newShareLink);
    return newShareLink;
  },

  async getBySlug(slug: string): Promise<ShareLink | null> {
    await delay(200);
    return shareLinksStore.find(link => link.slug === slug) || null;
  },

  async listByTarget(targetId: string): Promise<ShareLink[]> {
    await delay(200);
    return shareLinksStore.filter(link => link.targetId === targetId);
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const index = shareLinksStore.findIndex(link => link.id === id);
    if (index === -1) return false;
    
    shareLinksStore.splice(index, 1);
    return true;
  },
};

// Download Log API (kept for compatibility)
export const downloadLogApi = {
  async listByShareLink(shareLinkId: string): Promise<DownloadLog[]> {
    await delay(200);
    return [];
  },

  async create(data: Omit<DownloadLog, 'id' | 'at'>): Promise<DownloadLog> {
    await delay(300);
    const newLog: DownloadLog = {
      ...data,
      id: `log-${Date.now()}`,
      at: new Date().toISOString(),
    };
    return newLog;
  },
};

// User API
export const userApi = {
  async get(userId?: string): Promise<User> {
    await delay(200);
    if (userId) {
      return usersStore.find(user => user.id === userId) || userStore;
    }
    return userStore;
  },

  async update(data: Partial<User>): Promise<User> {
    await delay(300);
    userStore = { ...userStore, ...data };
    return userStore;
  },
};

// Favorite Folder API
export const favoriteFolderApi = {
  async list(): Promise<FavoriteFolder[]> {
    await delay(200);
    return favoriteFoldersStore.filter(folder => folder.ownerId === userStore.id);
  },

  async create(data: Omit<FavoriteFolder, 'id' | 'createdAt' | 'ownerId'>): Promise<FavoriteFolder> {
    await delay(300);
    const newFolder: FavoriteFolder = {
      ...data,
      id: `folder-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ownerId: userStore.id,
    };
    favoriteFoldersStore.push(newFolder);
    return newFolder;
  },

  async update(id: string, data: Partial<FavoriteFolder>): Promise<FavoriteFolder | null> {
    await delay(300);
    const index = favoriteFoldersStore.findIndex(folder => folder.id === id);
    if (index === -1) return null;
    
    favoriteFoldersStore[index] = { ...favoriteFoldersStore[index], ...data };
    return favoriteFoldersStore[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay(300);
    const index = favoriteFoldersStore.findIndex(folder => folder.id === id);
    if (index === -1) return false;
    
    favoriteFoldersStore.splice(index, 1);
    return true;
  },
};

// Download History API
export const downloadHistoryApi = {
  async getByUser(userId: string): Promise<DownloadHistory[]> {
    await delay(200);
    return downloadHistoryStore
      .filter(history => history.userId === userId)
      .sort((a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime());
  },

  async create(data: Omit<DownloadHistory, 'id'>): Promise<DownloadHistory> {
    await delay(300);
    const newHistory: DownloadHistory = {
      ...data,
      id: `history-${Date.now()}`,
    };
    downloadHistoryStore.push(newHistory);
    return newHistory;
  },
};

// Download Notification API
export const downloadNotificationApi = {
  async getByUser(userId: string): Promise<DownloadNotification[]> {
    await delay(200);
    // Get notifications for assets owned by the user
    const userAssets = assetsStore.filter(asset => asset.ownerId === userId);
    const userAssetIds = userAssets.map(asset => asset.id);
    
    return downloadNotificationsStore
      .filter(notification => userAssetIds.includes(notification.assetId))
      .sort((a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime());
  },

  async markAsRead(id: string): Promise<boolean> {
    await delay(200);
    const notification = downloadNotificationsStore.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    await delay(300);
    const userAssets = assetsStore.filter(asset => asset.ownerId === userId);
    const userAssetIds = userAssets.map(asset => asset.id);
    
    downloadNotificationsStore
      .filter(notification => userAssetIds.includes(notification.assetId))
      .forEach(notification => notification.read = true);
    
    return true;
  },
};

// File upload simulation
export const uploadApi = {
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<{ url: string; previewUrl: string }> {
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await delay(100);
        onProgress(i);
      }
    }

    // Generate mock URLs
    const mockUrl = `https://mock-cdn.sozailocker.com/${file.name}`;
    const previewUrl = file.type.startsWith('image/') 
      ? `https://picsum.photos/400/300?random=${Date.now()}`
      : `https://picsum.photos/400/300?random=${Date.now()}`;

    return {
      url: mockUrl,
      previewUrl,
    };
  },
};