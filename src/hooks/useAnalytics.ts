import { useCallback } from 'react';
import { AnalyticsEvent } from '@/core/types';

export const useAnalytics = () => {
  const track = useCallback((event: AnalyticsEvent) => {
    // In mock mode, just log to console
    // In production, this would send to analytics service
    console.log('📊 Analytics Event:', {
      timestamp: new Date().toISOString(),
      ...event,
    });

    // You could also store events in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('analytics-events') || '[]');
    events.push({
      timestamp: new Date().toISOString(),
      ...event,
    });
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    localStorage.setItem('analytics-events', JSON.stringify(events));
  }, []);

  const trackPageView = useCallback((page: string) => {
    track({ type: 'page_view', page });
  }, [track]);

  const trackClick = useCallback((element: string, location: string) => {
    track({ type: 'click', element, location });
  }, [track]);

  const trackUploadStart = useCallback((assetCount: number) => {
    track({ type: 'upload_start', assetCount });
  }, [track]);

  const trackUploadComplete = useCallback((assetId: string) => {
    track({ type: 'upload_complete', assetId });
  }, [track]);

  const trackShareCreated = useCallback((shareType: 'asset' | 'collection', targetId: string) => {
    track({ type: 'share_created', shareType, targetId });
  }, [track]);

  const trackDownload = useCallback((shareSlug: string) => {
    track({ type: 'download', shareSlug });
  }, [track]);

  const trackSettingsChange = useCallback((setting: string, value: any) => {
    track({ type: 'settings_change', setting, value });
  }, [track]);

  return {
    track,
    trackPageView,
    trackClick,
    trackUploadStart,
    trackUploadComplete,
    trackShareCreated,
    trackDownload,
    trackSettingsChange,
  };
};
