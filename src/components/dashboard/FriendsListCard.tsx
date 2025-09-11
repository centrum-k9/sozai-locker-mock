import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Download, 
  Eye,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { downloadHistoryApi, userApi, assetApi } from '@/services/mockClient';
import { User as UserType, Asset } from '@/core/types';
import { toast } from 'sonner';

interface FriendWithAssets {
  user: UserType;
  profileImage?: Asset;
  keyVisual?: Asset;
  lastDownloadDate: string;
}

export function FriendsListCard() {
  const [friends, setFriends] = useState<FriendWithAssets[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadFriends = async () => {
      if (!user) return;

      try {
        // Get download history to find friends
        const downloadHistory = await downloadHistoryApi.getByUser(user.id);
        
        // Group by owner to get unique friends
        const friendsMap = new Map<string, { lastDownloadDate: string }>();
        
        for (const download of downloadHistory) {
          if (!friendsMap.has(download.ownerId)) {
            friendsMap.set(download.ownerId, {
              lastDownloadDate: download.downloadedAt
            });
          } else {
            const existing = friendsMap.get(download.ownerId)!;
            if (new Date(download.downloadedAt) > new Date(existing.lastDownloadDate)) {
              existing.lastDownloadDate = download.downloadedAt;
            }
          }
        }

        // Get user details and their assets
        const friendsWithAssets: FriendWithAssets[] = [];
        
        for (const [ownerId, { lastDownloadDate }] of friendsMap) {
          try {
            const friendUser = await userApi.get(ownerId);
            if (friendUser) {
              let profileImage: Asset | undefined;
              let keyVisual: Asset | undefined;

              // Get profile image and key visual if they exist
              if (friendUser.mainAvatar) {
                profileImage = await assetApi.get(friendUser.mainAvatar);
              }
              if (friendUser.keyVisual) {
                keyVisual = await assetApi.get(friendUser.keyVisual);
              }

              friendsWithAssets.push({
                user: friendUser,
                profileImage,
                keyVisual,
                lastDownloadDate
              });
            }
          } catch (error) {
            console.error(`Failed to load friend ${ownerId}:`, error);
          }
        }

        // Sort by last download date
        friendsWithAssets.sort((a, b) => 
          new Date(b.lastDownloadDate).getTime() - new Date(a.lastDownloadDate).getTime()
        );

        setFriends(friendsWithAssets.slice(0, 5)); // Show top 5 friends
      } catch (error) {
        toast.error('友だちリストの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadFriends();
  }, [user]);

  const handleDownload = async (asset: Asset | undefined, type: 'profile' | 'kv') => {
    if (!asset) {
      toast.error('素材が見つかりません');
      return;
    }

    try {
      // Create download history entry
      await downloadHistoryApi.create({
        assetId: asset.id,
        userId: user!.id,
        ownerId: asset.ownerId,
        downloadedAt: new Date().toISOString()
      });

      // Create a blob URL for download (mock)
      const link = document.createElement('a');
      link.href = asset.previewUrl || '';
      link.download = `${asset.title}.${asset.mime.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${type === 'profile' ? '立ち絵' : 'KV'}をダウンロードしました`);
    } catch (error) {
      toast.error('ダウンロードに失敗しました');
    }
  };

  if (isLoading) {
    return (
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            友だちリスト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="rounded-full bg-muted h-10 w-10" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient border-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5" />
          友だちリスト ({friends.length})
        </CardTitle>
        <CardDescription>
          最近ダウンロードした作者一覧
        </CardDescription>
      </CardHeader>
      <CardContent>
        {friends.length > 0 ? (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.user.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.user.avatar} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/profile/${friend.user.id}`}
                      className="font-medium hover:text-primary transition-colors truncate block"
                    >
                      {friend.user.displayName || friend.user.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">
                      @{friend.user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {friend.profileImage && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(friend.profileImage, 'profile')}
                      className="text-xs px-2 py-1 h-7"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      立ち絵DL
                    </Button>
                  )}
                  
                  {friend.keyVisual && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(friend.keyVisual, 'kv')}
                      className="text-xs px-2 py-1 h-7"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      KV DL
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    asChild
                    className="text-xs px-2 py-1 h-7"
                  >
                    <Link to={`/profile/${friend.user.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      プロフィールを見る
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/friends">
                  すべての友だちを見る
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
            <h3 className="font-medium mb-1">まだ友だちはいません</h3>
            <p className="text-sm text-muted-foreground mb-3">
              他のユーザーの素材をダウンロードしてみましょう
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/assets">
                素材を探す
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}