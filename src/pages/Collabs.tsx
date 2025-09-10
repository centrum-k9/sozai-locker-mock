import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Users,
  Plus,
  Clock,
  Video,
  Sparkles,
  Crown
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { CollabEvent } from '@/features/collab/types';
import { collabsApi } from '@/features/collab/services/collabs';
import { useQuota } from '@/features/plan/hooks/useQuota';
import { toast } from 'sonner';
import { CreateCollabModal } from '@/components/collab/CreateCollabModal';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

const Collabs = () => {
  const [collabs, setCollabs] = useState<CollabEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { trackPageView, trackClick } = useAnalytics();
  const { quota, plan, isLoading: quotaLoading } = useQuota();

  useEffect(() => {
    trackPageView('collabs');
  }, [trackPageView]);

  useEffect(() => {
    const loadCollabs = async () => {
      try {
        const collabList = await collabsApi.listEvents();
        setCollabs(collabList);
      } catch (error) {
        toast.error('コラボ一覧の読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadCollabs();
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

  const formatScheduledDate = (scheduledAt?: string) => {
    if (!scheduledAt) return null;
    const date = new Date(scheduledAt);
    return formatDistanceToNow(date, { addSuffix: true, locale: ja });
  };

  const canCreateCollab = quota && collabs.length < quota.collabMax;
  const isAtLimit = quota && collabs.length >= quota.collabMax;

  if (isLoading || quotaLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">コラボ管理</h1>
                  <Badge variant="outline" className="animate-pulse border-primary/50 text-primary">
                    BETA
                  </Badge>
          </div>
          <p className="text-muted-foreground">
            コラボ相手と素材を管理して、配信準備をスムーズに 🎬
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {quota && (
            <div className="text-sm text-muted-foreground">
              {plan === 'PAID' ? (
                <div className="flex items-center gap-1">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  無制限
                </div>
              ) : (
                `${collabs.length}/${quota.collabMax}件`
              )}
            </div>
          )}
          
          <Button
            size="lg"
            className="hero-gradient hover:opacity-90 transition-opacity"
            disabled={!canCreateCollab}
            onClick={() => {
              if (isAtLimit) {
                toast.error('コラボリスト枠が上限に達しています。アーカイブまたはプラン変更をご検討ください。');
                return;
              }
              trackClick('create-collab', 'collabs');
              setShowCreateModal(true);
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            新しいコラボ
          </Button>
        </div>
      </div>

      {/* Quota Warning */}
      {isAtLimit && plan === 'FREE' && (
        <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-900 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium">コラボリスト枠が上限に達しました</h3>
                  <p className="text-sm text-muted-foreground">
                    友達を招待して枠を増やすか、プレミアムプランで無制限にできます
                  </p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/settings">設定を見る</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collabs Grid */}
      {collabs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collabs.map((collab) => (
            <Link
              key={collab.id}
              to={`/collabs/${collab.id}`}
              className="group block"
              onClick={() => trackClick('collab-card', 'collabs-list')}
            >
              <Card className="border hover:shadow-lg transition-all duration-200 group-hover:border-primary/50 card-gradient">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {collab.title}
                      </CardTitle>
                      {collab.description && (
                        <CardDescription className="line-clamp-2 mt-2">
                          {collab.description}
                        </CardDescription>
                      )}
                    </div>
                    {collab.platform && (
                      <div className="flex-shrink-0 ml-3">
                        {getPlatformIcon(collab.platform)}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {collab.scheduledAt && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatScheduledDate(collab.scheduledAt)}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        メンバー管理
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {formatDistanceToNow(new Date(collab.createdAt), { 
                          addSuffix: true, 
                          locale: ja 
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-primary/10 to-primary-glow/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">最初のコラボを作成しましょう</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            コラボ相手の素材を管理して、配信やイベントの準備をもっと簡単に
          </p>
          <Button
            size="lg"
            className="hero-gradient hover:opacity-90 transition-opacity"
            disabled={!canCreateCollab}
            onClick={() => {
              trackClick('create-first-collab', 'collabs-empty');
              setShowCreateModal(true);
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            コラボを作成
          </Button>
        </div>
      )}

      {/* Create Collab Modal */}
      <CreateCollabModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCollabCreated={(newCollab) => {
          setCollabs(prev => [newCollab, ...prev]);
        }}
      />
    </div>
  );
};

export default Collabs;