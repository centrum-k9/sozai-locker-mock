import { OverlayConfig } from '../types';

// Mock overlay configs storage (localStorage for persistence)
const STORAGE_KEY = 'overlay-configs';

const getConfigsFromStorage = (): OverlayConfig[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to parse overlay configs from storage:', error);
    return [];
  }
};

const saveConfigsToStorage = (configs: OverlayConfig[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (error) {
    console.warn('Failed to save overlay configs to storage:', error);
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const overlayConfigService = {
  async createOrUpdate(config: OverlayConfig): Promise<OverlayConfig> {
    await delay(300);
    
    const configs = getConfigsFromStorage();
    const existingIndex = configs.findIndex(c => c.id === config.id);
    
    const updatedConfig = {
      ...config,
      updatedAt: new Date().toISOString(),
    };
    
    if (existingIndex >= 0) {
      configs[existingIndex] = updatedConfig;
    } else {
      configs.push(updatedConfig);
    }
    
    saveConfigsToStorage(configs);
    return updatedConfig;
  },

  async getById(id: string): Promise<OverlayConfig | null> {
    await delay(200);
    
    const configs = getConfigsFromStorage();
    return configs.find(c => c.id === id) || null;
  },

  async listByCollab(collabId: string): Promise<OverlayConfig[]> {
    await delay(200);
    
    const configs = getConfigsFromStorage();
    return configs
      .filter(c => c.collabId === collabId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async delete(id: string): Promise<boolean> {
    await delay(200);
    
    const configs = getConfigsFromStorage();
    const filteredConfigs = configs.filter(c => c.id !== id);
    
    if (filteredConfigs.length === configs.length) {
      return false; // Config not found
    }
    
    saveConfigsToStorage(filteredConfigs);
    return true;
  },

  // Generate unique config ID
  generateId(): string {
    return `overlay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};