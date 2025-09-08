import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileImage, 
  FolderOpen, 
  Share2, 
  TrendingUp,
  Clock,
  Plus,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { assetApi, collectionApi } from '@/services/mockClient';
import { Asset, Collection } from '@/core/types';
import { toast } from 'sonner';
import { UploadModal } from '@/components/modals/UploadModal';

const Dashboard = () => {
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [recentCollections, setRecentCollections] = useState<Collection[]>([]);
  const [stats, setStats] = useState({ assets: 0, collections: 0, shares: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const { user } = useAuth();
  const { trackPageView, trackClick } = useAnalytics();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    trackPageView('dashboard');
    
    // Check if upload modal should be shown
    if (searchParams.get('upload') === 'true') {
      setShowUpload(true);
    }
  }, [trackPageView, searchParams]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [assetsResponse, collectionsResponse] = await Promise.all([
          assetApi.list(1, 4),
          collectionApi.list(1, 3)
        ]);

        setRecentAssets(assetsResponse.items);
        setRecentCollections(collectionsResponse.items);
        setStats({
          assets: assetsResponse.pagination.total,
          collections: collectionsResponse.pagination.total,
          shares: 3, // Mock share count
        });
      } catch (error) {
        toast.error('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statsCards = [
    {
      title: '総素材数',
      value: stats.assets,
      icon: FileImage,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: 'コレクション',
      value: stats.collections,
      icon: FolderOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: '共有リンク',
      value: stats.shares,
      icon: Share2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: '今月のビュー',
      value: 127,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  if (isLoading) {
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
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            おかえりなさい、{user?.name}さん！
          </h1>
          <p className="text-muted-foreground">
            今日も素晴らしい作品を作っていきましょう 🎨
          </p>
        </div>
        <Button
          size="lg"
          className="hero-gradient hover:opacity-90 transition-opacity"
          onClick={() => {
            trackClick('upload-quick', 'dashboard');
            setShowUpload(true);
          }}
        >
          <Upload className="mr-2 h-5 w-5" />
          素材をアップロード
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-gradient border-0 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Assets */}
      <Card className="card-gradient border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              最近の素材
            </CardTitle>
            <CardDescription>
              最近アップロードした素材です
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link 
              to="/assets"
              onClick={() => trackClick('view-all-assets', 'dashboard')}
            >
              すべて見る
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentAssets.map((asset) => (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.id}`}
                  className="group block"
                  onClick={() => trackClick('asset-card', 'dashboard-recent')}
                >
                  <Card className="border hover:shadow-md transition-all duration-200 group-hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        {asset.previewUrl && (
                          <img
                            src={asset.previewUrl}
                            alt={asset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {asset.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {asset.category}
                        </Badge>
                        <span>{(asset.size / 1024 / 1024).toFixed(1)}MB</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileImage className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">まだ素材がありません</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setShowUpload(true)}
              >
                最初の素材をアップロード
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Collections */}
      <Card className="card-gradient border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FolderOpen className="mr-2 h-5 w-5" />
              最近のコレクション
            </CardTitle>
            <CardDescription>
              最近作成したコレクションです
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link 
              to="/collections"
              onClick={() => trackClick('view-all-collections', 'dashboard')}
            >
              すべて見る
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentCollections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentCollections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.id}`}
                  className="group block"
                  onClick={() => trackClick('collection-card', 'dashboard-recent')}
                >
                  <Card className="border hover:shadow-md transition-all duration-200 group-hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground mr-3">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {collection.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {collection.itemIds.length}個の素材
                          </p>
                        </div>
                      </div>
                      {collection.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">まだコレクションがありません</p>
              <Button
                variant="outline"
                className="mt-2"
                asChild
              >
                <Link to="/collections">
                  <Plus className="mr-2 h-4 w-4" />
                  コレクションを作成
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <UploadModal
        open={showUpload}
        onOpenChange={setShowUpload}
        onUploadComplete={(asset) => {
          setRecentAssets(prev => [asset, ...prev.slice(0, 3)]);
          setStats(prev => ({ ...prev, assets: prev.assets + 1 }));
        }}
      />
    </div>
  );
};

export default Dashboard;