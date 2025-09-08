import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Copy,
  Share2,
  Download,
  Eye,
  Calendar,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { shareApi } from '@/services/mockClient';
import { ShareLink } from '@/core/types';
import { toast } from 'sonner';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'asset' | 'collection';
  targetId: string;
  targetTitle: string;
  onShareCreated?: (shareLink: ShareLink) => void;
}

export const ShareModal = ({ 
  open, 
  onOpenChange, 
  type, 
  targetId, 
  targetTitle,
  onShareCreated 
}: ShareModalProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [createdShare, setCreatedShare] = useState<ShareLink | null>(null);
  const [settings, setSettings] = useState({
    canDownload: true,
    passwordEnabled: false,
    password: '',
    expiresAt: '',
  });

  const { trackShareCreated } = useAnalytics();

  const createShareLink = async () => {
    setIsCreating(true);
    try {
      const shareData = {
        type,
        targetId,
        canDownload: settings.canDownload,
        passwordEnabled: settings.passwordEnabled,
        password: settings.passwordEnabled ? settings.password : undefined,
        expiresAt: settings.expiresAt || undefined,
      };

      const newShare = await shareApi.create(shareData);
      setCreatedShare(newShare);
      onShareCreated?.(newShare);
      trackShareCreated(type, targetId);
      toast.success('共有リンクを作成しました');
    } catch (error) {
      toast.error('共有リンクの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('クリップボードにコピーしました');
  };

  const getShareUrl = (slug: string) => {
    return `${window.location.origin}/s/${slug}`;
  };

  const handleClose = () => {
    setCreatedShare(null);
    setSettings({
      canDownload: true,
      passwordEnabled: false,
      password: '',
      expiresAt: '',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            共有リンクを作成
          </DialogTitle>
          <DialogDescription>
            「{targetTitle}」の共有設定を行います
          </DialogDescription>
        </DialogHeader>

        {!createdShare ? (
          <div className="space-y-6">
            {/* Download Permission */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">ダウンロード許可</Label>
                <p className="text-sm text-muted-foreground">
                  閲覧者がファイルをダウンロードできるようにします
                </p>
              </div>
              <Switch
                checked={settings.canDownload}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, canDownload: checked }))
                }
              />
            </div>

            <Separator />

            {/* Password Protection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">パスワード保護</Label>
                  <p className="text-sm text-muted-foreground">
                    パスワードを知っている人のみアクセス可能
                  </p>
                </div>
                <Switch
                  checked={settings.passwordEnabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, passwordEnabled: checked }))
                  }
                />
              </div>
              
              {settings.passwordEnabled && (
                <div>
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={settings.password}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="パスワードを入力"
                  />
                </div>
              )}
            </div>

            <Separator />

            {/* Expiration */}
            <div className="space-y-3">
              <Label htmlFor="expires">有効期限（オプション）</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={settings.expiresAt}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, expiresAt: e.target.value }))
                }
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground">
                設定しない場合は無期限で有効です
              </p>
            </div>

            {/* Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">設定内容</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {settings.canDownload ? (
                      <Download className="h-4 w-4 text-green-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-orange-500" />
                    )}
                    <span>
                      {settings.canDownload ? 'ダウンロード可能' : 'プレビューのみ'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Lock className={`h-4 w-4 ${settings.passwordEnabled ? 'text-blue-500' : 'text-muted-foreground'}`} />
                    <span>
                      {settings.passwordEnabled ? 'パスワード保護あり' : 'パスワード保護なし'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className={`h-4 w-4 ${settings.expiresAt ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    <span>
                      {settings.expiresAt ? `期限: ${new Date(settings.expiresAt).toLocaleString('ja-JP')}` : '無期限'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={createShareLink}
                disabled={isCreating || (settings.passwordEnabled && !settings.password)}
                className="flex-1 hero-gradient hover:opacity-90 transition-opacity"
              >
                {isCreating ? '作成中...' : '共有リンクを作成'}
              </Button>
              <Button variant="outline" onClick={handleClose}>
                キャンセル
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <Share2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-1">共有リンクが作成されました！</h3>
              <p className="text-sm text-muted-foreground">
                以下のリンクから{targetTitle}にアクセスできます
              </p>
            </div>

            {/* Share Link */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">共有URL</Label>
                    <div className="flex gap-1">
                      {createdShare.canDownload && (
                        <Badge variant="default" className="text-xs">
                          <Download className="mr-1 h-3 w-3" />
                          DL可
                        </Badge>
                      )}
                      {createdShare.passwordEnabled && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="mr-1 h-3 w-3" />
                          保護
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={getShareUrl(createdShare.slug)}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getShareUrl(createdShare.slug))}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {createdShare.passwordEnabled && createdShare.password && (
                    <div>
                      <Label className="text-sm font-medium">パスワード</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={createdShare.password}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(createdShare.password!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => window.open(getShareUrl(createdShare.slug), '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                プレビュー
              </Button>
              <Button onClick={handleClose} className="flex-1">
                閉じる
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};