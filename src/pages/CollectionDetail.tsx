import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { collectionApi, assetApi } from '@/services/mockClient';
import { Collection, Asset } from '@/core/types';
import { AssetCardActions } from '@/components/assets/AssetCardActions';
import { toast } from 'sonner';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('collection-detail');
    if (id) {
      loadCollection(id);
    }
  }, [id, trackPageView]);

  const loadCollection = async (collectionId: string) => {
    try {
      const data = await collectionApi.get(collectionId);
      setCollection(data);
      
      // Load assets in collection
      if (data?.itemIds) {
        const assetPromises = data.itemIds.map(assetId => assetApi.get(assetId));
        const assetResults = await Promise.all(assetPromises);
        setAssets(assetResults.filter(Boolean) as Asset[]);
      }
    } catch (error) {
      console.error('Failed to load collection:', error);
      toast.error('コレクションの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetStanding = (assetId: string) => {
    toast.success('立ち絵に設定しました');
  };

  const handleSetKeyVisual = (assetId: string) => {
    toast.success('KVに設定しました');  
  };

  const handleToggleFavorite = (assetId: string) => {
    toast.success('お気に入りに追加しました');
  };

  const handleDelete = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    toast.success('素材を削除しました');
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return <div className="container py-8">コレクションが見つかりません</div>;
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>{collection.title}</CardTitle>
          {collection.description && (
            <p className="text-muted-foreground">{collection.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {assets.length}個の素材が含まれています
          </p>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      {assets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <Card key={asset.id} className="group border hover:shadow-md transition-all duration-200 relative overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden relative">
                  <img
                    src={asset.previewUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <AssetCardActions
                    asset={asset}
                    onSetStanding={handleSetStanding}
                    onSetKeyVisual={handleSetKeyVisual}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                  />
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{asset.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{asset.category}</span>
                  <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="card-gradient border-0">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">このコレクションには素材がありません</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CollectionDetail;