import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus } from 'lucide-react';
import { WatermarkedImage } from '@/components/media/WatermarkedImage';
import { assetApi, collectionApi } from '@/services/mockClient';
import { Asset } from '@/core/types';
import { toast } from 'sonner';

interface CreateCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCollectionCreated?: (collection: any) => void;
}

export function CreateCollectionModal({ 
  open, 
  onOpenChange, 
  onCollectionCreated 
}: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (open) {
      loadAssets();
    }
  }, [open]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const response = await assetApi.list(1, 50);
      setAssets(response.items);
    } catch (error) {
      toast.error('素材の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAssetSelection = (assetId: string) => {
    const newSelection = new Set(selectedAssets);
    if (newSelection.has(assetId)) {
      newSelection.delete(assetId);
    } else {
      newSelection.add(assetId);
    }
    setSelectedAssets(newSelection);
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('コレクション名を入力してください');
      return;
    }

    setIsCreating(true);
    try {
      const newCollection = {
        title: name.trim(),
        description: description.trim(),
        itemIds: Array.from(selectedAssets),
        createdAt: new Date().toISOString(),
      };

      const created = await collectionApi.create(newCollection);
      
      toast.success('コレクションを作成しました');
      onCollectionCreated?.(created);
      
      // Reset form
      setName('');
      setDescription('');
      setSelectedAssets(new Set());
      onOpenChange(false);
    } catch (error) {
      toast.error('コレクションの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>新しいコレクションを作成</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="collection-name">コレクション名 *</Label>
              <Input
                id="collection-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="コレクション名を入力"
              />
            </div>
            <div>
              <Label htmlFor="collection-description">説明</Label>
              <Textarea
                id="collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="コレクションの説明を入力"
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label>素材を選択 ({selectedAssets.size}個選択中)</Label>
            <div className="mt-2 max-h-96 overflow-y-auto border rounded-lg p-4">
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
                        selectedAssets.has(asset.id) ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => toggleAssetSelection(asset.id)}
                    >
                      <CardContent className="p-2 relative">
                        {selectedAssets.has(asset.id) && (
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
                  <p className="text-muted-foreground">素材がありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="hero-gradient hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? '作成中...' : 'コレクションを作成'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}