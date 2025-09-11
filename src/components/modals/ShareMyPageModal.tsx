import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ShareMyPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareMyPageModal({ open, onOpenChange }: ShareMyPageModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  if (!user) return null;

  const shareUrl = `${window.location.origin}/profile/${user.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('URLをコピーしました');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('コピーに失敗しました');
    }
  };

  const handleOpen = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>マイページ共有</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            あなたのマイページを他の人と共有できます。
            ログインしていないユーザーは閲覧専用となり、素材のダウンロードにはログインが必要です。
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">共有URL</label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleOpen}
                className="shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              📊 閲覧数追跡
            </Badge>
            <Badge variant="secondary" className="text-xs">
              🔒 透かし付きプレビュー
            </Badge>
            <Badge variant="secondary" className="text-xs">
              💾 ダウンロード制限
            </Badge>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              閉じる
            </Button>
            <Button onClick={handleCopy}>
              URLをコピー
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}