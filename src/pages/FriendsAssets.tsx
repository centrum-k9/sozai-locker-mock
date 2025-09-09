import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Download, 
  Clock, 
  Eye,
  Heart,
  ExternalLink,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { downloadHistoryApi, assetApi, userApi } from '@/services/mockClient';
import { DownloadHistory, Asset, User as UserType } from '@/core/types';
import { categoryInfo } from '@/services/seed';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface FriendAssetData {
  user: UserType;
  assets: (Asset & { downloadedAt: string })[];
  lastDownloadDate: string;
}

const FriendsAssets = () => {
  const [friendsData, setFriendsData] = useState<FriendAssetData[]>([]);
  const [recentDownloads, setRecentDownloads] = useState<(Asset & { downloadedAt: string; owner: UserType })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { trackPageView, trackClick } = useAnalytics();

  useEffect(() => {
    trackPageView('friends-assets');
  }, [trackPageView]);

  useEffect(() => {
    const loadFriendsAssets = async () => {
      if (!user) return;

      try {
        // Get download history
        const downloadHistory = await downloadHistoryApi.getByUser(user.id);
        
        // Group by owner and get asset & user details
        const friendsMap = new Map<string, FriendAssetData>();
        const recentAssetsWithOwner: (Asset & { downloadedAt: string; owner: UserType })[] = [];

        for (const download of downloadHistory) {
          const [asset, owner] = await Promise.all([
            assetApi.get(download.assetId),
            userApi.get(download.ownerId)
          ]);

          if (asset && owner) {
            // Add to recent downloads
            recentAssetsWithOwner.push({
              ...asset,
              downloadedAt: download.downloadedAt,
              owner
            });

            // Group by owner
            if (!friendsMap.has(owner.id)) {
              friendsMap.set(owner.id, {
                user: owner,
                assets: [],
                lastDownloadDate: download.downloadedAt
              });
            }

            const friendData = friendsMap.get(owner.id)!;
            friendData.assets.push({
              ...asset,
              downloadedAt: download.downloadedAt
            });

            // Update last download date if more recent
            if (new Date(download.downloadedAt) > new Date(friendData.lastDownloadDate)) {
              friendData.lastDownloadDate = download.downloadedAt;
            }
          }
        }

        // Sort friends by last download date
        const sortedFriends = Array.from(friendsMap.values())
          .sort((a, b) => new Date(b.lastDownloadDate).getTime() - new Date(a.lastDownloadDate).getTime());

        // Sort recent downloads by date
        const sortedRecent = recentAssetsWithOwner
          .sort((a, b) => new Date(b.downloadedAt).getTime() - new Date(a.downloadedAt).getTime())
          .slice(0, 8);

        setFriendsData(sortedFriends);
        setRecentDownloads(sortedRecent);
      } catch (error) {
        toast.error('友達の素材の読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadFriendsAssets();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-3" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalDownloads = friendsData.reduce((acc, friend) => acc + friend.assets.length, 0);

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8" />
            友達の素材
          </h1>
          <p className="text-muted-foreground mt-2">
            過去にダウンロードした他のユーザーの素材と最新情報
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-gradient border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">フォロー中</p>
                <p className="text-2xl font-bold text-primary">{friendsData.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">総ダウンロード数</p>
                <p className="text-2xl font-bold text-green-600">{totalDownloads}</p>
              </div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">今週のDL</p>
                <p className="text-2xl font-bold text-blue-600">
                  {recentDownloads.filter(asset => {
                    const downloadDate = new Date(asset.downloadedAt);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return downloadDate > weekAgo;
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Downloads */}
      {recentDownloads.length > 0 && (
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              最近ダウンロードした素材
            </CardTitle>
            <CardDescription>
              最新のダウンロード履歴から表示しています
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentDownloads.map((asset) => (
                <Card key={`${asset.id}-${asset.downloadedAt}`} className="border hover:shadow-md transition-all duration-200 group">
                  <CardContent className="p-4">
                    <Link 
                      to={`/profile/${asset.owner.id}`}
                      className="block"
                      onClick={() => trackClick('view-friend-profile', 'friends-recent')}
                    >
                      <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden watermark-overlay"
                           data-watermark={asset.owner.watermarkText}>
                        <img
                          src={asset.previewUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </Link>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {asset.title}
                      </h3>
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage src={asset.owner.avatar} />
                          <AvatarFallback>{asset.owner.displayName?.[0] || asset.owner.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{asset.owner.displayName || asset.owner.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {categoryInfo[asset.category]?.icon} {asset.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(asset.downloadedAt), 'MM/dd', { locale: ja })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Friends List */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            フォロー中のユーザー
          </CardTitle>
          <CardDescription>
            過去にダウンロードしたユーザーのページへのリンクです
          </CardDescription>
        </CardHeader>
        <CardContent>
          {friendsData.length > 0 ? (
            <div className="space-y-4">
              {friendsData.map((friend) => (
                <div
                  key={friend.user.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={friend.user.avatar} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {friend.user.displayName || friend.user.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        @{friend.user.name}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-muted-foreground">
                        <Download className="h-3 w-3 mr-1" />
                        <span>{friend.assets.length}個の素材をダウンロード</span>
                        <Calendar className="h-3 w-3 ml-4 mr-1" />
                        <span>
                          最終: {format(new Date(friend.lastDownloadDate), 'MM月dd日', { locale: ja })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link 
                        to={`/profile/${friend.user.id}`}
                        onClick={() => trackClick('view-friend-profile', 'friends-list')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        プロフィール
                      </Link>
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        trackClick('favorite-friend', 'friends-list');
                        toast.success('お気に入りに追加しました');
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">まだフォローしているユーザーはいません</h3>
              <p className="text-muted-foreground mb-4">
                他のユーザーの素材をダウンロードすると、ここに表示されます
              </p>
              <Button variant="outline" asChild>
                <Link to="/assets">
                  素材を探す
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsAssets;