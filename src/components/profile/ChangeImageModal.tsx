import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Image as ImageIcon } from 'lucide-react';
import { WatermarkedImage } from '@/components/media/WatermarkedImage';
import { assetApi } from '@/services/mockClient';
import { Asset } from '@/core/types';
import { toast } from 'sonner';

interface ChangeImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'standing' | 'keyVisual';
  onImageSelected: (imageUrl: string) => void;
}

export function ChangeImageModal({ 
  open, 
  onOpenChange, 
  type, 
  onImageSelected 
}: ChangeImageModalProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const response = await assetApi.list(1, 20);
      setAssets(response.items);
    } catch (error) {
      toast.error('素材の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (asset: Asset) => {
    setSelectedAsset(asset.id);
  };

  const handleConfirm = () => {
    const asset = assets.find(a => a.id === selectedAsset);
    if (asset && asset.previewUrl) {
      onImageSelected(asset.previewUrl);
      toast.success(`${type === 'standing' ? '立ち絵' : 'キービジュアル'}を変更しました`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {type === 'standing' ? '立ち絵' : 'キービジュアル'}を選択
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-2">
                    <div className="aspect-video bg-muted rounded" />
                    <div className="h-3 bg-muted rounded mt-2 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : assets.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <Card 
                  key={asset.id} 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedAsset === asset.id ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => handleSelect(asset)}
                >
                  <CardContent className="p-2 relative">
                    {selectedAsset === asset.id && (
                      <div className="absolute top-1 right-1 z-10">
                        <CheckCircle className="h-5 w-5 text-primary bg-background rounded-full" />
                      </div>
                    )}
                    <div className="aspect-video mb-2">
                      <WatermarkedImage
                        src={asset.previewUrl}
                        alt={asset.title}
                        className="w-full h-full rounded"
                      />
                    </div>
                    <p className="text-sm font-medium line-clamp-1">{asset.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {asset.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {(asset.size / 1024 / 1024).toFixed(1)}MB
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">素材がありません</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedAsset}
            className="hero-gradient hover:opacity-90"
          >
            変更する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}