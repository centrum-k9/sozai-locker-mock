import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Share2,
  Download,
  Edit,
  Trash2,
  Calendar,
  FileImage,
  Tag,
  Shield,
  Eye,
  Copy,
  User,
  Heart,
  FolderOpen
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { assetApi, shareApi, downloadLogApi } from '@/services/mockClient';
import { Asset, ShareLink, DownloadLog } from '@/core/types';
import { licensePresetInfo, categoryInfo } from '@/services/seed';
import { toast } from 'sonner';
import { ShareModal } from '@/components/modals/ShareModal';
import { WatermarkedImage } from '@/components/media/WatermarkedImage';

const AssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trackPageView, trackClick } = useAnalytics();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [downloadLogs, setDownloadLogs] = useState<DownloadLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editData, setEditData] = useState<Partial<Asset>>({});

  useEffect(() => {
    trackPageView('asset-detail');
  }, [trackPageView]);

  useEffect(() => {
    if (id) {
      loadAssetData(id);
    }
  }, [id]);

  const loadAssetData = async (assetId: string) => {
    setIsLoading(true);
    try {
      const [assetData, shareLinksData] = await Promise.all([
        assetApi.get(assetId),
        shareApi.listByTarget(assetId),
      ]);

      if (!assetData) {
        toast.error('素材が見つかりません');
        navigate('/assets');
        return;
      }

      setAsset(assetData);
      setShareLinks(shareLinksData);
      setEditData(assetData);

      // Load download logs for share links
      if (shareLinksData.length > 0) {
        const logs = await Promise.all(
          shareLinksData.map(link => downloadLogApi.listByShareLink(link.id))
        );
        setDownloadLogs(logs.flat());
      }
    } catch (error) {
      toast.error('データの読み込みに失敗しました');
      navigate('/assets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!asset || !id) return;

    try {
      const updatedAsset = await assetApi.update(id, editData);
      if (updatedAsset) {
        setAsset(updatedAsset);
        setIsEditing(false);
        toast.success('素材を更新しました');
        trackClick('asset-update', 'asset-detail');
      }
    } catch (error) {
      toast.error('更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (!confirm('この素材を削除してもよろしいですか？この操作は取り消せません。')) {
      return;
    }

    try {
      await assetApi.delete(id);
      toast.success('素材を削除しました');
      trackClick('asset-delete', 'asset-detail');
      navigate('/assets');
    } catch (error) {
      toast.error('削除に失敗しました');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('クリップボードにコピーしました');
    trackClick('copy-link', 'asset-detail');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-64 bg-muted rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) return null;

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/assets')}
          className="shrink-0"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          素材一覧に戻る
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{asset.title}</h1>
          <p className="text-muted-foreground">
            {formatDate(asset.createdAt)} に作成
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditing ? 'キャンセル' : '編集'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            削除
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview */}
          <Card className="card-gradient border-0">
            <CardContent className="p-6">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <WatermarkedImage
                  src={asset.previewUrl}
                  alt={asset.title}
                  className="w-full h-full"
                />
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">タイトル</Label>
                    <Input
                      id="title"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">説明</Label>
                    <Textarea
                      id="description"
                      value={editData.description || ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags">タグ（カンマ区切り）</Label>
                    <Input
                      id="tags"
                      value={editData.tags?.join(', ') || ''}
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleSave} className="hero-gradient">
                      保存
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      キャンセル
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-2">{asset.title}</h2>
                  {asset.description && (
                    <p className="text-muted-foreground mb-4">{asset.description}</p>
                  )}
                  {asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {asset.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Share Links */}
          {shareLinks.length > 0 && (
            <Card className="card-gradient border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  共有リンク
                </CardTitle>
                <CardDescription>
                  この素材の共有リンク一覧です
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shareLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <code className="text-sm bg-background px-2 py-1 rounded">
                        /s/{link.slug}
                      </code>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={link.canDownload ? "default" : "secondary"} className="text-xs">
                          {link.canDownload ? 'ダウンロード可' : 'プレビューのみ'}
                        </Badge>
                        {link.passwordEnabled && (
                          <Badge variant="outline" className="text-xs">
                            パスワード保護
                          </Badge>
                        )}
                        {link.expiresAt && (
                          <Badge variant="outline" className="text-xs">
                            期限: {formatDate(link.expiresAt)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(`${window.location.origin}/s/${link.slug}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link to={`/s/${link.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Asset Info */}
          <Card className="card-gradient border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileImage className="mr-2 h-5 w-5" />
                素材情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">カテゴリ</Label>
                <div className="mt-1">
                  {asset.category && (
                    <Badge variant="secondary">
                      {categoryInfo[asset.category as keyof typeof categoryInfo]?.icon} {asset.category}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">ファイルサイズ</Label>
                <p className="mt-1 font-medium">{formatFileSize(asset.size)}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">ファイル形式</Label>
                <p className="mt-1 font-mono text-sm">{asset.mime}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">作成日時</Label>
                <p className="mt-1 text-sm">{formatDate(asset.createdAt)}</p>
                
                {/* Action Buttons */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm">
                      <User className="mr-2 h-4 w-4" />
                      立ち絵に設定
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      KVに設定
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      お気に入り
                    </Button>
                  </div>
                  
                  {/* Related Collections */}
                  <div className="mt-4 pt-4 border-t">
                    <Label className="text-xs text-muted-foreground">追加されているコレクション</Label>
                    <div className="mt-2 space-y-2">
                      <Link 
                        to="/collections/collection-1" 
                        className="block p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm">メインコレクション</span>
                        </div>
                      </Link>
                      <Link 
                        to="/collections/collection-2" 
                        className="block p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm">お気に入り素材</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Info - Hidden per requirements */}
          {false && (
            <Card className="card-gradient border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  ライセンス情報
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="outline" className={licensePresetInfo[asset.licensePreset].color}>
                    {licensePresetInfo[asset.licensePreset].label}
                  </Badge>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {licensePresetInfo[asset.licensePreset].description}
                  </p>
                </div>
                
                {asset.creditText && (
                  <div>
                    <Label className="text-xs text-muted-foreground">クレジット表記</Label>
                    <div className="mt-1 p-2 bg-muted rounded text-sm font-mono">
                      {asset.creditText}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Download Stats */}
          {downloadLogs.length > 0 && (
            <Card className="card-gradient border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  ダウンロード履歴
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{downloadLogs.length}</div>
                  <p className="text-sm text-muted-foreground">
                    総ダウンロード数
                  </p>
                  {downloadLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="text-xs text-muted-foreground border-l-2 border-muted pl-2">
                      <div>{log.actorLabel || 'ゲスト'}</div>
                      <div>{formatDate(log.at)}</div>
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        type="asset"
        targetId={asset.id}
        targetTitle={asset.title}
        onShareCreated={(shareLink) => {
          setShareLinks(prev => [shareLink, ...prev]);
        }}
      />
    </div>
  );
};

export default AssetDetail;