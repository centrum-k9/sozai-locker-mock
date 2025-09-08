import { useMemo } from 'react';

export interface FeatureFlags {
  mockMode: boolean;
  debugMode: boolean;
  enableCollections: boolean;
  enableAdvancedSharing: boolean;
  enableAnalytics: boolean;
  enableWatermark: boolean;
}

export const useFlags = (): FeatureFlags => {
  return useMemo(() => {
    // In development, all features are enabled for testing
    // In production, these would come from a feature flag service
    const isDevelopment = import.meta.env.DEV;
    
    return {
      mockMode: true, // Always true for MVP
      debugMode: isDevelopment,
      enableCollections: true,
      enableAdvancedSharing: true,
      enableAnalytics: true,
      enableWatermark: true,
    };
  }, []);
};