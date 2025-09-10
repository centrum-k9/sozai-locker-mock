import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Video, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CollabEvent } from '@/features/collab/types';
import { collabsApi } from '@/features/collab/services/collabs';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export const UpcomingCollabsCard = () => {
  const [collabs, setCollabs] = useState<CollabEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUpcomingCollabs = async () => {
      try {
        const allCollabs = await collabsApi.listEvents();
        // Filter and sort by scheduled date (ascending)
        const upcoming = allCollabs
          .filter(collab => collab.scheduledAt && new Date(collab.scheduledAt) > new Date())
          .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime())
          .slice(0, 3);
        setCollabs(upcoming);
      } catch (error) {
        console.error('Failed to load upcoming collabs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpcomingCollabs();
  }, []);

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'YouTube':
        return <Video className="h-4 w-4 text-red-500" />;
      case 'Twitch':
        return <Video className="h-4 w-4 text-purple-500" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="card-gradient border-0 animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2 mb-2" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded" />
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
          <Calendar className="mr-2 h-5 w-5" />
          直近のコラボ予定
        </CardTitle>
        <CardDescription>
          配信予定のコラボイベント
        </CardDescription>
      </CardHeader>
      <CardContent>
        {collabs.length > 0 ? (
          <div className="space-y-4">
            {collabs.map((collab) => (
              <div key={collab.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium line-clamp-1">{collab.title}</h4>
                    {collab.platform && (
                      <Badge variant="outline" className="text-xs">
                        {getPlatformIcon(collab.platform)}
                        {collab.platform}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {collab.scheduledAt && formatDistanceToNow(new Date(collab.scheduledAt), { 
                      addSuffix: true, 
                      locale: ja 
                    })}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/collabs/${collab.id}`}>
                    コラボ素材管理へ
                  </Link>
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link to="/collabs">
                すべてのコラボを見る
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">配信予定のコラボはありません</p>
            <Button variant="outline" className="mt-2" asChild>
              <Link to="/collabs">
                コラボを作成
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};