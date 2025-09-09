import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bell, 
  Download, 
  Eye, 
  CheckCheck,
  Clock,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { downloadNotificationApi, assetApi } from '@/services/mockClient';
import { DownloadNotification, Asset } from '@/core/types';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const Notifications = () => {
  const [notifications, setNotifications] = useState<DownloadNotification[]>([]);
  const [assets, setAssets] = useState<Record<string, Asset>>({});
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const { trackPageView, trackClick } = useAnalytics();

  useEffect(() => {
    trackPageView('notifications');
  }, [trackPageView]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;

      try {
        const notificationsData = await downloadNotificationApi.getByUser(user.id);
        setNotifications(notificationsData);

        // Load asset details
        const assetIds = [...new Set(notificationsData.map(n => n.assetId))];
        const assetData: Record<string, Asset> = {};
        
        await Promise.all(
          assetIds.map(async (assetId) => {
            const asset = await assetApi.get(assetId);
            if (asset) {
              assetData[assetId] = asset;
            }
          })
        );
        
        setAssets(assetData);
      } catch (error) {
        toast.error('通知の読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await downloadNotificationApi.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      trackClick('mark-notification-read', 'notifications');
    } catch (error) {
      toast.error('通知の更新に失敗しました');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;

    try {
      await downloadNotificationApi.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('すべての通知を既読にしました');
      trackClick('mark-all-notifications-read', 'notifications');
    } catch (error) {
      toast.error('通知の更新に失敗しました');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8" />
            素材ダウンロード通知
          </h1>
          <p className="text-muted-foreground mt-2">
            あなたの素材がダウンロードされた際の通知です
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            すべて既読にする
            <Badge variant="secondary" className="ml-2">
              {unreadCount}
            </Badge>
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-gradient border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">未読通知</p>
                <p className="text-2xl font-bold text-destructive">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">総通知数</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Download className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">今月のDL数</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => {
                    const downloadDate = new Date(n.downloadedAt);
                    const now = new Date();
                    return downloadDate.getMonth() === now.getMonth() && 
                           downloadDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>通知履歴</CardTitle>
          <CardDescription>
            最新のダウンロード通知から表示されています
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const asset = assets[notification.assetId];
                if (!asset) return null;

                return (
                  <div
                    key={notification.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                      notification.read 
                        ? 'bg-muted/30 border-border' 
                        : 'bg-primary/5 border-primary/20 shadow-sm'
                    }`}
                  >
                    {/* Asset Thumbnail */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                        {asset.previewUrl && (
                          <img
                            src={asset.previewUrl}
                            alt={asset.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="h-4 w-4 text-primary flex-shrink-0" />
                        <p className="font-semibold text-sm">
                          「{asset.title}」がダウンロードされました
                        </p>
                        {!notification.read && (
                          <Badge variant="destructive" className="ml-auto">
                            新着
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <User className="h-3 w-3 mr-1" />
                        <span>{notification.downloaderName}</span>
                        <Clock className="h-3 w-3 ml-4 mr-1" />
                        <span>
                          {format(new Date(notification.downloadedAt), 'MM月dd日 HH:mm', { locale: ja })}
                        </span>
                      </div>

                      <Badge variant="secondary" className="text-xs">
                        {asset.category}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link 
                          to={`/assets/${asset.id}`}
                          onClick={() => trackClick('view-asset-from-notification', 'notifications')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          詳細
                        </Link>
                      </Button>
                      
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCheck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">通知はまだありません</h3>
              <p className="text-muted-foreground mb-4">
                あなたの素材がダウンロードされると、ここに通知が表示されます
              </p>
              <Button variant="outline" asChild>
                <Link to="/assets">
                  素材をアップロード
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;