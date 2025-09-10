import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Heart, 
  ExternalLink, 
  Star,
  Youtube,
  Twitch,
  Twitter,
  Music,
  MessageCircle,
  Settings,
  FolderOpen,
  Plus
} from 'lucide-react';
import { ShareMyPageButton } from '@/components/profile/ShareMyPageButton';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { assetApi, favoriteFolderApi } from '@/services/mockClient';
import { Asset, FavoriteFolder } from '@/core/types';
import { toast } from 'sonner';

const MyProfile = () => {
  const [myAssets, setMyAssets] = useState<Asset[]>([]);
  const [favoriteFolders, setFavoriteFolders] = useState<FavoriteFolder[]>([]);
  const [favoriteAssets, setFavoriteAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { trackPageView, trackClick } = useAnalytics();

  useEffect(() => {
    trackPageView('my-profile');
  }, [trackPageView]);

  useEffect(() => {
    const loadMyData = async () => {
      if (!user) return;

      try {
        const [assetsResponse, foldersResponse] = await Promise.all([
          assetApi.list(1, 50, { ownerId: user.id }),
          favoriteFolderApi.list()
        ]);

        setMyAssets(assetsResponse.items);
        setFavoriteFolders(foldersResponse);
        setFavoriteAssets(assetsResponse.items.filter(asset => asset.isFavorite));
      } catch (error) {
        toast.error('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadMyData();
  }, [user]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Youtube className="h-4 w-4" />;
      case 'twitch': return <Twitch className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'tiktok': return <Music className="h-4 w-4" />;
      case 'discord': return <MessageCircle className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
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

  if (!user) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">ログインが必要です</p>
      </div>
    );
  }

  const mainAvatarAsset = myAssets.find(asset => asset.id === user.mainAvatar);
  const keyVisualAsset = myAssets.find(asset => asset.id === user.keyVisual);

  return (
    <div className="container py-8 space-y-8">
      {/* Profile Header */}
      <Card className="card-gradient border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    {user.displayName || user.name}
                  </h1>
                  <p className="text-muted-foreground">@{user.name}</p>
                </div>
                <div className="flex gap-2">
                  <ShareMyPageButton />
                  <Button variant="outline" asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      設定
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Social Links */}
              {user.socialLinks && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(user.socialLinks).map(([platform, url]) => (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      asChild
                      className="hover:bg-primary/10"
                    >
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {getSocialIcon(platform)}
                        <span className="ml-2 capitalize">{platform}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              )}

              {/* Usage Rules */}
              {user.usageRules && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    素材利用ルール
                  </h3>
                  <p className="text-sm text-muted-foreground">{user.usageRules}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Avatar */}
        <Card className="card-gradient border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                メイン立ち絵
              </CardTitle>
              <CardDescription>プロフィールのメイン画像</CardDescription>
            </div>
            {!mainAvatarAsset && (
              <Button size="sm" variant="outline" asChild>
                <Link to="/assets">設定</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {mainAvatarAsset ? (
              <Link to={`/assets/${mainAvatarAsset.id}`} className="block group">
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                  <img
                    src={mainAvatarAsset.previewUrl}
                    alt={mainAvatarAsset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="mt-3 font-semibold text-center">{mainAvatarAsset.title}</h3>
              </Link>
            ) : (
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">メイン立ち絵を設定してください</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Visual */}
        <Card className="card-gradient border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                キービジュアル
              </CardTitle>
              <CardDescription>チャンネルやイベントのメイン画像</CardDescription>
            </div>
            {!keyVisualAsset && (
              <Button size="sm" variant="outline" asChild>
                <Link to="/assets">設定</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {keyVisualAsset ? (
              <Link to={`/assets/${keyVisualAsset.id}`} className="block group">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={keyVisualAsset.previewUrl}
                    alt={keyVisualAsset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="mt-3 font-semibold text-center">{keyVisualAsset.title}</h3>
              </Link>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">キービジュアルを設定してください</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Favorite Folders */}
      <Card className="card-gradient border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              お気に入りフォルダ
            </CardTitle>
            <CardDescription>素材をフォルダ別に整理できます</CardDescription>
          </div>
          <Button size="sm" className="hero-gradient">
            <Plus className="h-4 w-4 mr-2" />
            フォルダ作成
          </Button>
        </CardHeader>
        <CardContent>
          {favoriteFolders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {favoriteFolders.map((folder) => (
                <Card key={folder.id} className="border hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground mr-3">
                        <FolderOpen className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">{folder.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {folder.assetIds.length}個の素材
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">まだフォルダがありません</p>
              <Button variant="outline" className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                最初のフォルダを作成
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Favorite Assets */}
      {favoriteAssets.length > 0 && (
        <Card className="card-gradient border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                お気に入り素材
              </CardTitle>
              <CardDescription>よく使う素材をまとめています</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link to="/assets?filter=favorites">すべて見る</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {favoriteAssets.slice(0, 6).map((asset) => (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.id}`}
                  className="group block"
                  onClick={() => trackClick('favorite-asset', 'my-profile')}
                >
                  <Card className="border hover:shadow-md transition-all duration-200 group-hover:border-primary/50">
                    <CardContent className="p-3">
                      <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                        <img
                          src={asset.previewUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <h3 className="font-semibold text-xs line-clamp-1">{asset.title}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {asset.category}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyProfile;