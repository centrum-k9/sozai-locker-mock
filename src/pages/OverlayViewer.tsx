import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { overlayConfigService } from '@/features/overlay/services/configs';
import { overlayGenerator } from '@/features/overlay/services/generator';
import { OverlayConfig } from '@/features/overlay/types';

const OverlayViewer = () => {
  const { configId } = useParams<{ configId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadOverlay = async () => {
      if (!configId) {
        setError('設定IDが指定されていません');
        setIsLoading(false);
        return;
      }

      try {
        const config = await overlayConfigService.getById(configId);
        
        if (!config) {
          setError('オーバーレイ設定が見つかりません');
          setIsLoading(false);
          return;
        }

        // Generate HTML for the overlay
        // For demo purposes, we'll create mock member data
        const mockMembers = [
          {
            id: 'user-1',
            displayName: 'ミクちゃん',
            discordAvatar: 'https://via.placeholder.com/64x64?text=ミク',
            standingImage: null,
            keyVisual: null,
          },
          {
            id: 'user-2',
            displayName: 'リンちゃん',
            discordAvatar: 'https://via.placeholder.com/64x64?text=リン',
            standingImage: null,
            keyVisual: null,
          },
          {
            id: 'user-3',
            displayName: 'ルカさん',
            discordAvatar: 'https://via.placeholder.com/64x64?text=ルカ',
            standingImage: null,
            keyVisual: null,
          },
        ];

        const source = await overlayGenerator.generateAggregateHTML(config, mockMembers);
        setHtmlContent(source.html);
      } catch (error) {
        setError('オーバーレイの読み込みに失敗しました');
        console.error('Error loading overlay:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOverlay();
  }, [configId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="text-xl mb-2">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  // Render the generated HTML directly
  return (
    <div 
      className="fixed inset-0"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default OverlayViewer;