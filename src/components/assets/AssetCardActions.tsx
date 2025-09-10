import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Star, 
  Eye, 
  Trash2,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Asset } from '@/core/types';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';

interface AssetCardActionsProps {
  asset: Asset;
  onSetStanding?: (assetId: string) => void;
  onSetKeyVisual?: (assetId: string) => void;
  onToggleFavorite?: (assetId: string) => void;
  onDelete?: (assetId: string) => void;
}

export const AssetCardActions = ({ 
  asset, 
  onSetStanding, 
  onSetKeyVisual, 
  onToggleFavorite, 
  onDelete 
}: AssetCardActionsProps) => {
  const { trackClick } = useAnalytics();

  const handleSetStanding = () => {
    onSetStanding?.(asset.id);
    toast.success('立ち絵に設定しました');
    trackClick('set-standing', 'asset-card');
  };

  const handleSetKeyVisual = () => {
    onSetKeyVisual?.(asset.id);
    toast.success('KVに設定しました');
    trackClick('set-kv', 'asset-card');
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(asset.id);
    toast.success('お気に入りに追加しました');
    trackClick('toggle-favorite', 'asset-card');
  };

  const handleDelete = () => {
    if (confirm('この素材を削除してもよろしいですか？')) {
      onDelete?.(asset.id);
      toast.success('素材を削除しました');
      trackClick('delete-asset', 'asset-card');
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSetStanding}
          title="立ち絵に設定"
        >
          <User className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSetKeyVisual}
          title="KVに設定"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleToggleFavorite}
          title="お気に入り"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          asChild
          title="詳細を見る"
        >
          <Link to={`/assets/${asset.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          title="削除"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};