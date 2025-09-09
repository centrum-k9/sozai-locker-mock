import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Heart, 
  ExternalLink, 
  UserPlus,
  Youtube,
  Twitch,
  Twitter,
  Music,
  MessageCircle,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { userApi, assetApi } from '@/services/mockClient';
import { User as UserType, Asset } from '@/core/types';
import { toast } from 'sonner';

const Profile = () => {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [userAssets, setUserAssets] = useState<Asset[]>([]);
  const [favoriteAssets, setFavoriteAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);

  const { user: currentUser } = useAuth();
  const { trackPageView, trackClick } = useAnalytics();
  const isOwnProfile = !userId || userId === currentUser?.id;

  useEffect(() => {
    trackPageView(isOwnProfile ? 'my-profile' : 'user-profile');
  }, [trackPageView, isOwnProfile]);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const targetUserId = userId || currentUser?.id;
        if (!targetUserId) return;

        const [userResponse, assetsResponse] = await Promise.all([
          userApi.get(targetUserId),
          assetApi.list(1, 20, { ownerId: targetUserId })
        ]);

        setProfileUser(userResponse);
        setUserAssets(assetsResponse.items);
        
        if (isOwnProfile) {
          setFavoriteAssets(assetsResponse.items.filter(asset => asset.isFavorite));
        }
      } catch (error) {
        toast.error('プロフィールの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [userId, currentUser?.id, isOwnProfile]);

  const handleFriendRequest = () => {
    trackClick('friend-request', 'profile');
    toast.success('フレンド申請を送信しました');
    setIsFriend(true);
  };

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

  if (!profileUser) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">ユーザーが見つかりません</p>
      </div>
    );
  }

  const mainAvatarAsset = userAssets.find(asset => asset.id === profileUser.mainAvatar);
  const keyVisualAsset = userAssets.find(asset => asset.id === profileUser.keyVisual);

  return (
    <div className="container py-8 space-y-8">
      {/* Profile Header */}
      <Card className="card-gradient border-0">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileUser.avatar} alt={profileUser.displayName} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {profileUser.displayName || profileUser.name}
                  {!isOwnProfile && (
                    <Button
                      size="sm"
                      variant={isFriend ? "secondary" : "default"}
                      onClick={handleFriendRequest}
                      disabled={isFriend}
                      className="hero-gradient"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      {isFriend ? 'フレンド申請済み' : 'フレンド申請'}
                    </Button>
                  )}
                </h1>
                <p className="text-muted-foreground">@{profileUser.name}</p>
              </div>

              {/* Social Links */}
              {profileUser.socialLinks && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(profileUser.socialLinks).map(([platform, url]) => (
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
              {profileUser.usageRules && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    素材利用ルール
                  </h3>
                  <p className="text-sm text-muted-foreground">{profileUser.usageRules}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Avatar */}
        {mainAvatarAsset && (
          <Card className="card-gradient border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                メイン立ち絵
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={`/assets/${mainAvatarAsset.id}`} className="block group">
                <div className={`aspect-[3/4] bg-muted rounded-lg overflow-hidden ${!isOwnProfile ? 'watermark-overlay' : ''}`}
                     data-watermark={!isOwnProfile ? profileUser.watermarkText : ''}>
                  <img
                    src={mainAvatarAsset.previewUrl}
                    alt={mainAvatarAsset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="mt-3 font-semibold text-center">{mainAvatarAsset.title}</h3>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Key Visual */}
        {keyVisualAsset && (
          <Card className="card-gradient border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                キービジュアル
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to={`/assets/${keyVisualAsset.id}`} className="block group">
                <div className={`aspect-video bg-muted rounded-lg overflow-hidden ${!isOwnProfile ? 'watermark-overlay' : ''}`}
                     data-watermark={!isOwnProfile ? profileUser.watermarkText : ''}>
                  <img
                    src={keyVisualAsset.previewUrl}
                    alt={keyVisualAsset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <h3 className="mt-3 font-semibold text-center">{keyVisualAsset.title}</h3>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assets Section */}
      {isOwnProfile && favoriteAssets.length > 0 && (
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favoriteAssets.slice(0, 4).map((asset) => (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.id}`}
                  className="group block"
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
                      <h3 className="font-semibold text-sm line-clamp-1">{asset.title}</h3>
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

      {/* All Assets */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>素材一覧</CardTitle>
          <CardDescription>
            {isOwnProfile ? 'あなたの' : `${profileUser.displayName || profileUser.name}の`}素材です
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userAssets.map((asset) => (
              <Link
                key={asset.id}
                to={`/assets/${asset.id}`}
                className="group block"
              >
                <Card className="border hover:shadow-md transition-all duration-200 group-hover:border-primary/50">
                  <CardContent className="p-3">
                    <div className={`aspect-square bg-muted rounded-lg mb-2 overflow-hidden ${!isOwnProfile ? 'watermark-overlay' : ''}`}
                         data-watermark={!isOwnProfile ? profileUser.watermarkText : ''}>
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
          {userAssets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">まだ素材がありません</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;