import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { shareApi, assetApi, collectionApi } from '@/services/mockClient';
import { ShareLink, Asset, Collection } from '@/core/types';
import { licensePresetInfo } from '@/services/seed';

const Share = () => {
  const { slug } = useParams<{ slug: string }>();
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [content, setContent] = useState<Asset | Collection | null>(null);
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('share');
    if (slug) {
      loadShareContent(slug);
    }
  }, [slug, trackPageView]);

  const loadShareContent = async (shareSlug: string) => {
    try {
      const share = await shareApi.getBySlug(shareSlug);
      if (!share) return;

      setShareLink(share);

      if (share.type === 'asset') {
        const asset = await assetApi.get(share.targetId);
        setContent(asset);
      } else {
        const collection = await collectionApi.get(share.targetId);
        setContent(collection);
      }
    } catch (error) {
      console.error('Failed to load share content:', error);
    }
  };

  if (!shareLink || !content) {
    return <div className="container py-8">Loading...</div>;
  }

  const isAsset = shareLink.type === 'asset';
  const asset = isAsset ? content as Asset : null;

  return (
    <div className="container py-8 max-w-4xl">
      <Card className="card-gradient border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">
            {isAsset ? asset?.title : (content as Collection).title}
          </CardTitle>
          <div className="watermark-overlay aspect-video bg-muted rounded-lg mb-4" data-watermark="ラクコラ Sample">
            {isAsset && asset?.previewUrl && (
              <img
                src={asset.previewUrl}
                alt={asset.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isAsset && asset && (
            <>
              <div className="text-center">
                <Badge variant="outline" className={licensePresetInfo[asset.licensePreset].color}>
                  {licensePresetInfo[asset.licensePreset].label}
                </Badge>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">利用規約</h3>
                <p>{licensePresetInfo[asset.licensePreset].description}</p>
                {asset.creditText && (
                  <div className="mt-2">
                    <strong>クレジット表記：</strong>
                    <code className="ml-2 bg-background px-2 py-1 rounded">{asset.creditText}</code>
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            Powered by ラクコラ
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Share;