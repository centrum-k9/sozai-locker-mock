import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileImage, 
  FolderOpen, 
  Users, 
  Calendar, 
  Plus,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Demo mock data
const demoStats = {
  totalAssets: 12,
  totalCollections: 3,
  totalFriends: 5,
  upcomingCollabs: 2,
};

const demoRecentAssets = [
  {
    id: 'demo-1',
    name: 'メイン立ち絵（通常）',
    thumbnail_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
    file_type: 'image/png',
  },
  {
    id: 'demo-2',
    name: 'キービジュアル（春）',
    thumbnail_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=200&fit=crop',
    file_type: 'image/png',
  },
  {
    id: 'demo-3',
    name: 'SDキャラクター',
    thumbnail_url: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=200&h=200&fit=crop',
    file_type: 'image/png',
  },
];

const demoUpcomingCollabs = [
  {
    id: 'demo-collab-1',
    title: '年末ゲーム配信コラボ',
    scheduled_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube',
    memberCount: 4,
  },
  {
    id: 'demo-collab-2',
    title: '新年カウントダウン配信',
    scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'twitch',
    memberCount: 3,
  },
];

const demoFriends = [
  {
    id: 'friend-1',
    friend_name: 'VTuber花子',
    friend_avatar_url: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=100&h=100&fit=crop&crop=face',
    friend_twitter_handle: '@hanako_vtuber',
  },
  {
    id: 'friend-2',
    friend_name: 'ゲーム実況者A',
    friend_avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    friend_twitter_handle: '@gamer_a',
  },
  {
    id: 'friend-3',
    friend_name: '歌い手Bさん',
    friend_avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    friend_twitter_handle: '@singer_b',
  },
];

const demoDownloadNotifications = [
  {
    id: 'notif-1',
    downloaderName: 'VTuber花子',
    assetName: 'メイン立ち絵（通常）',
    downloadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    downloaderName: 'ゲーム実況者A',
    assetName: 'キービジュアル（春）',
    downloadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

export default function DemoDashboard() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'たった今';
    if (diffHours < 24) return `${diffHours}時間前`;
    return `${Math.floor(diffHours / 24)}日前`;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Demo Mode Alert */}
      <Alert className="bg-accent/20 border-accent">
        <Info className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            <strong>デモモード</strong>で閲覧中です。実際にアカウントを作成すると、あなた専用のデータで利用できます。
          </span>
          <Link to="/auth">
            <Button size="sm" className="ml-4 hero-gradient">
              アカウント作成
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </AlertDescription>
      </Alert>

      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            おかえりなさい、デモユーザーさん！
          </h1>
          <p className="text-muted-foreground">
            コラボ配信の準備をラクにしましょう
          </p>
        </div>
        <Badge variant="secondary" className="bg-accent text-accent-foreground">
          <Sparkles className="w-3 h-3 mr-1" />
          デモモード
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileImage className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{demoStats.totalAssets}</p>
                <p className="text-sm text-muted-foreground">素材</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <FolderOpen className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{demoStats.totalCollections}</p>
                <p className="text-sm text-muted-foreground">コレクション</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{demoStats.totalFriends}</p>
                <p className="text-sm text-muted-foreground">フレンド</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/20">
                <Calendar className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{demoStats.upcomingCollabs}</p>
                <p className="text-sm text-muted-foreground">予定コラボ</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Assets */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">最近の素材</CardTitle>
            <Link to="/demo/assets">
              <Button variant="ghost" size="sm">
                すべて見る
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {demoRecentAssets.map((asset) => (
                <Link 
                  key={asset.id} 
                  to={`/demo/assets/${asset.id}`}
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border/50 group-hover:border-primary/50 transition-colors">
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium truncate">{asset.name}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Collabs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">予定のコラボ</CardTitle>
            <Link to="/demo/collabs">
              <Button variant="ghost" size="sm">
                すべて見る
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {demoUpcomingCollabs.map((collab) => (
              <Link 
                key={collab.id} 
                to={`/demo/collabs/${collab.id}`}
                className="block"
              >
                <div className="p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{collab.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {collab.platform}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(collab.scheduled_at)}</span>
                    <span>{collab.memberCount}人参加</span>
                  </div>
                </div>
              </Link>
            ))}
            <Button variant="outline" className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新規コラボを作成
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Friends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">フレンド</CardTitle>
            <Link to="/demo/friends">
              <Button variant="ghost" size="sm">
                すべて見る
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoFriends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.friend_avatar_url || undefined} />
                    <AvatarFallback>{friend.friend_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{friend.friend_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {friend.friend_twitter_handle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Download Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">ダウンロード通知</CardTitle>
            <Link to="/demo/notifications">
              <Button variant="ghost" size="sm">
                すべて見る
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoDownloadNotifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-full bg-primary/10">
                    <FileImage className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{notif.downloaderName}</span>
                      さんが
                      <span className="font-medium">{notif.assetName}</span>
                      をダウンロードしました
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notif.downloadedAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
