import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

// Mock notification data for demo
const mockNotifications = [
  {
    id: '1',
    userName: 'ミクちゃん',
    userAvatar: '/placeholder.svg',
    assetName: '立ち絵セット',
    downloadedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2', 
    userName: 'リンちゃん',
    userAvatar: '/placeholder.svg',
    assetName: 'キービジュアル',
    downloadedAt: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    userName: 'ルカさん',
    userAvatar: '/placeholder.svg', 
    assetName: 'BGM素材',
    downloadedAt: '2024-01-13T09:45:00Z'
  }
];

export const DownloadNotificationCard = () => {
  return (
    <Card className="card-gradient border-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          ダウンロード通知
        </CardTitle>
        <CardDescription>
          あなたの素材がダウンロードされました
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNotifications.map((notification) => (
            <div key={notification.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={notification.userAvatar} alt={notification.userName} />
                <AvatarFallback>{notification.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{notification.userName}</span>さんが
                  <span className="font-medium">{notification.assetName}</span>をダウンロード
                </p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDistanceToNow(new Date(notification.downloadedAt), { 
                    addSuffix: true, 
                    locale: ja 
                  })}
                </p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2" asChild>
            <Link to="/notifications">
              すべて見る
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};