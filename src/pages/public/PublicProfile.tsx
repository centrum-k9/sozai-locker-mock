import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  ExternalLink, 
  Lock,
  LogIn,
  UserPlus
} from 'lucide-react';
import { userApi, assetApi } from '@/services/mockClient';
import { User as UserType, Asset } from '@/core/types';
import { categoryInfo } from '@/services/seed';

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<UserType | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!userId) return;

      try {
        const [user, assetsResponse] = await Promise.all([
          userApi.get(userId),
          assetApi.list(1, 50, { ownerId: userId })
        ]);

        if (user) {
          setProfileUser(user);
          setAssets(assetsResponse.items);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ユーザーが見つかりません</h1>
          <p className="text-muted-foreground">指定されたプロフィールは存在しないか、非公開に設定されています。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14 px-4">
          <Link to="/" className="text-xl font-bold">
            ラクコラ
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth?mode=login">
                <LogIn className="h-4 w-4 mr-1" />
                ログイン
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth?mode=register">
                <UserPlus className="h-4 w-4 mr-1" />
                新規登録
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Profile Header */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileUser.avatar} />
                  <AvatarFallback>
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <CardTitle className="text-2xl">
                    {profileUser.displayName || profileUser.name}
                  </CardTitle>
                  <p className="text-muted-foreground">@{profileUser.name}</p>
                  
                  {profileUser.usageRules && (
                    <p className="mt-2 text-sm">{profileUser.usageRules}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            {profileUser.socialLinks && Object.keys(profileUser.socialLinks).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(profileUser.socialLinks)
                  .filter(([_, url]) => url) // Only show links that have URLs
                  .map(([platform, url]) => (
                    <Button
                      key={platform}
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {platform}
                      </a>
                    </Button>
                  ))}
              </div>
            )}
          </CardHeader>
        </Card>

        {/* Download Notice */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                  素材をダウンロードするにはログインが必要です
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  この作者の素材をダウンロード・使用するには、アカウント登録（無料）が必要です。
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth?mode=login">
                      ログイン
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/auth?mode=register">
                      新規登録（無料）
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle>公開素材 ({assets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {assets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map((asset) => (
                  <Card key={asset.id} className="border hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden watermark-overlay"
                           data-watermark={profileUser.watermarkText}>
                        <img
                          src={asset.previewUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm line-clamp-1">
                          {asset.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {categoryInfo[asset.category]?.icon} {asset.category}
                          </Badge>
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">公開素材がありません</h3>
                <p className="text-muted-foreground">
                  このユーザーはまだ素材を公開していません。
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicProfile;