import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Users,
  Download,
  Sparkles,
  Calendar,
  ExternalLink,
  Archive,
  User,
  Image as ImageIcon,
  Package,
  Monitor,
  Edit,
  Plus
} from 'lucide-react';
import { EditCollabDialog } from '@/components/collab/EditCollabDialog';
import { PlatformIcon } from '@/components/collab/PlatformIcon';
import { useAnalytics } from '@/hooks/useAnalytics';
import { CollabEvent, CollabMember, Friend } from '@/features/collab/types';
import { collabsApi } from '@/features/collab/services/collabs';
import { friendsApi } from '@/features/collab/services/friends';
import { assetApi } from '@/services/mockClient';
import { Asset } from '@/core/types';
import { TextGeneratorModal } from '@/features/collab/components/TextGeneratorModal';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import { ja } from 'date-fns/locale';

const CollabDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trackPageView, trackClick } = useAnalytics();
  
  const [collab, setCollab] = useState<CollabEvent | null>(null);
  const [members, setMembers] = useState<CollabMember[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showTextGenerator, setShowTextGenerator] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    trackPageView('collab-detail');
  }, [trackPageView]);

  useEffect(() => {
    const loadCollabData = async () => {
      if (!id) return;

      try {
        const [collabData, membersData, friendsData] = await Promise.all([
          collabsApi.getEvent(id),
          collabsApi.getMembers(id),
          friendsApi.list(),
        ]);

        if (!collabData) {
          toast.error('コラボが見つかりません');
          navigate('/collabs');
          return;
        }

        setCollab(collabData);
        setMembers(membersData);
        setFriends(friendsData);

        // Load assets for members
        const assetIds = new Set<string>();
        membersData.forEach(member => {
          const friend = friendsData.find(f => f.id === member.friendId);
          if (friend?.defaultStandingAssetId) assetIds.add(friend.defaultStandingAssetId);
          if (friend?.defaultKeyVisualAssetId) assetIds.add(friend.defaultKeyVisualAssetId);
          if (member.overrideStandingAssetId) assetIds.add(member.overrideStandingAssetId);
          if (member.overrideKeyVisualAssetId) assetIds.add(member.overrideKeyVisualAssetId);
        });

        const assetPromises = Array.from(assetIds).map(async (assetId) => {
          const asset = await assetApi.get(assetId);
          return { assetId, asset };
        });

        const assetResults = await Promise.all(assetPromises);
        const assetMap: Record<string, Asset> = {};
        assetResults.forEach(({ assetId, asset }) => {
          if (asset) assetMap[assetId] = asset;
        });
        setAssets(assetMap);
      } catch (error) {
        toast.error('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadCollabData();
  }, [id, navigate]);

  const handleDownloadAsset = async (assetId: string, assetTitle: string) => {
    try {
      trackClick('download-asset', 'collab-detail');
      // Mock download
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${assetTitle} をダウンロードしました`);
    } catch (error) {
      toast.error('ダウンロードに失敗しました');
    }
  };

  const handleBulkDownload = async () => {
    try {
      trackClick('bulk-download', 'collab-detail');
      toast.loading('ZIPファイルを作成中...');
      
      // Mock ZIP creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('すべての素材をZIPでダウンロードしました');
    } catch (error) {
      toast.error('一括ダウンロードに失敗しました');
    }
  };

  const handleEditCollab = async (data: Partial<CollabEvent>) => {
    if (!id) return;
    
    try {
      // Mock update
      setCollab(prev => prev ? { ...prev, ...data } : null);
      toast.success('コラボ情報を更新しました');
    } catch (error) {
      toast.error('更新に失敗しました');
    }
  };

  const getMemberFriend = (member: CollabMember): Friend | undefined => {
    return friends.find(friend => friend.id === member.friendId);
  };

  const getMemberAssets = (member: CollabMember) => {
    const friend = getMemberFriend(member);
    if (!friend) return { standing: null, keyVisual: null };

    const standingAssetId = member.overrideStandingAssetId || friend.defaultStandingAssetId;
    const keyVisualAssetId = member.overrideKeyVisualAssetId || friend.defaultKeyVisualAssetId;

    return {
      standing: standingAssetId ? assets[standingAssetId] || null : null,
      keyVisual: keyVisualAssetId ? assets[keyVisualAssetId] || null : null,
    };
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">コラボが見つかりません</p>
        <Button asChild className="mt-4">
          <Link to="/collabs">コラボ一覧に戻る</Link>
        </Button>
      </div>
    );
  }

  const memberFriends = members.map(getMemberFriend).filter(Boolean) as Friend[];

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/collabs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{collab.title}</h1>
          {collab.description && (
            <p className="text-muted-foreground mt-1">{collab.description}</p>
          )}
        </div>
      </div>

      {/* Collab Info */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              コラボ情報
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                コラボ情報編集
              </Button>
              {collab.platform && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-md border">
                  <PlatformIcon platform={collab.platform} />
                  <span className="text-sm">{collab.platform}</span>
                </div>
              )}
              <Button 
                className="hero-gradient hover:opacity-90" 
                size="sm"
                onClick={() => setShowTextGenerator(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                概要欄テキスト作成
              </Button>
              <Button
                className="hero-gradient hover:opacity-90"
                size="sm"
                asChild
              >
                <Link to={`/collabs/${collab.id}/overlay`}>
                  <Monitor className="mr-2 h-4 w-4" />
                  OBS素材作成
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {collab.scheduledAt && (
              <div>
                <div className="font-medium text-muted-foreground">配信予定</div>
                <div>{format(new Date(collab.scheduledAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}</div>
              </div>
            )}
            <div>
              <div className="font-medium text-muted-foreground">作成日</div>
              <div>{formatDistanceToNow(new Date(collab.createdAt), { addSuffix: true, locale: ja })}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">参加メンバー</div>
              <div>{members.length}名</div>
            </div>
          </div>
          
          {collab.streamUrl && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">配信URL</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={collab.streamUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    開く
                  </a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Members and Assets */}
      <Card className="card-gradient border-0">
        <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                メンバーと素材 ({members.length})
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  コラボ相手を追加
                </Button>
                {members.length > 0 && (
                  <Button 
                    className="hero-gradient hover:opacity-90"
                    onClick={handleBulkDownload}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    まとめてDL
                  </Button>
                )}
              </div>
            </div>
        </CardHeader>
        <CardContent>
          {members.length > 0 ? (
            <div className="space-y-6">
              {members.map((member) => {
                const friend = getMemberFriend(member);
                const { standing, keyVisual } = getMemberAssets(member);
                
                if (!friend) return null;

                return (
                  <div key={member.id} className="border rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={standing?.previewUrl} alt={friend.displayName} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link 
                            to={`/profile/${friend.id}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {friend.displayName}
                          </Link>
                          {member.role && (
                            <Badge variant={member.role === 'Main' ? 'default' : 'secondary'}>
                              {member.role}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {friend.xHandle && (
                            <div>X: @{friend.xHandle}</div>
                          )}
                          {friend.youtubeUrl && (
                            <div>YouTube: {friend.youtubeUrl}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Assets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Standing Asset */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            立ち絵
                          </h4>
                          {standing && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadAsset(standing.id, standing.title)}
                            >
                              <Download className="mr-2 h-3 w-3" />
                              DL
                            </Button>
                          )}
                        </div>
                        {standing ? (
                          <Link 
                            to={`/assets/${standing.id}`}
                            className="block group"
                          >
                            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                              <img
                                src={standing.previewUrl}
                                alt={standing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <p className="text-xs text-center mt-1 group-hover:text-primary">
                              {standing.title}
                            </p>
                          </Link>
                        ) : (
                          <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-xs">素材未設定</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Key Visual Asset */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm flex items-center">
                            <ImageIcon className="mr-2 h-4 w-4" />
                            キービジュアル
                          </h4>
                          {keyVisual && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadAsset(keyVisual.id, keyVisual.title)}
                            >
                              <Download className="mr-2 h-3 w-3" />
                              DL
                            </Button>
                          )}
                        </div>
                        {keyVisual ? (
                          <Link 
                            to={`/assets/${keyVisual.id}`}
                            className="block group"
                          >
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <img
                                src={keyVisual.previewUrl}
                                alt={keyVisual.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <p className="text-xs text-center mt-1 group-hover:text-primary">
                              {keyVisual.title}
                            </p>
                          </Link>
                        ) : (
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-xs">素材未設定</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">まだメンバーが追加されていません</p>
              <Button variant="outline" className="mt-2">
                <Users className="mr-2 h-4 w-4" />
                メンバーを追加
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <TextGeneratorModal
        open={showTextGenerator}
        onOpenChange={setShowTextGenerator}
        members={memberFriends}
        eventTitle={collab.title}
      />

      <EditCollabDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        collab={collab}
        onSave={handleEditCollab}
      />
    </div>
  );
};

export default CollabDetail;