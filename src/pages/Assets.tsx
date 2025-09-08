import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';
import { 
  Search,
  Filter,
  Grid,
  List,
  Upload,
  SortAsc,
  Calendar,
  Tag,
  FileImage,
  Music,
  Palette
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { assetApi } from '@/services/mockClient';
import { Asset, FilterOptions, SortOption, ViewMode, Category } from '@/core/types';
import { licensePresetInfo, categoryInfo } from '@/services/seed';
import { Pagination } from '@/components/ui/pagination';
import { toast } from 'sonner';

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  
  const { trackPageView, trackClick } = useAnalytics();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = (searchParams.get('category') as Category) || undefined;
  const selectedLicense = searchParams.get('license') as any || undefined;
  const sortOption = (searchParams.get('sort') as SortOption) || 'created-desc';

  useEffect(() => {
    trackPageView('assets');
  }, [trackPageView]);

  useEffect(() => {
    loadAssets();
  }, [currentPage, searchQuery, selectedCategory, selectedLicense, sortOption]);

  const loadAssets = async () => {
    setIsLoading(true);
    try {
      const filters: FilterOptions = {
        search: searchQuery || undefined,
        category: selectedCategory,
        license: selectedLicense,
      };

      const response = await assetApi.list(currentPage, 12, filters, sortOption);
      setAssets(response.items);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      toast.error('素材の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if ('page' in updates) {
      newParams.set('page', updates.page || '1');
    } else {
      newParams.set('page', '1');
    }

    setSearchParams(newParams);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">素材一覧</h1>
          <p className="text-muted-foreground">
            アップロードした素材を管理・検索できます
          </p>
        </div>
        <Button
          className="hero-gradient hover:opacity-90 transition-opacity"
          onClick={() => trackClick('upload-assets', 'assets-page')}
          asChild
        >
          <Link to="/dashboard?upload=true">
            <Upload className="mr-2 h-4 w-4" />
            素材をアップロード
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="card-gradient border-0">
        <CardContent className="p-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="素材を検索..."
              value={searchQuery}
              onChange={(e) => updateSearchParams({ search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Category Filter */}
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) => 
                  updateSearchParams({ category: value || undefined })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="カテゴリ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
                  {Object.keys(categoryInfo).map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryInfo[category as Category].icon} {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* License Filter */}
              <Select
                value={selectedLicense || ''}
                onValueChange={(value) => 
                  updateSearchParams({ license: value || undefined })
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="ライセンス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">すべて</SelectItem>
                  {Object.entries(licensePresetInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={sortOption}
                onValueChange={(value) => 
                  updateSearchParams({ sort: value as SortOption })
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created-desc">
                    <SortAsc className="mr-2 h-4 w-4" />
                    新しい順
                  </SelectItem>
                  <SelectItem value="created-asc">作成日（古い順）</SelectItem>
                  <SelectItem value="title-asc">タイトル（昇順）</SelectItem>
                  <SelectItem value="title-desc">タイトル（降順）</SelectItem>
                  <SelectItem value="size-desc">サイズ（大きい順）</SelectItem>
                  <SelectItem value="size-asc">サイズ（小さい順）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => {
                if (value) {
                  setViewMode(value as ViewMode);
                  trackClick(`view-mode-${value}`, 'assets-page');
                }
              }}
            >
              <ToggleGroupItem value="card" aria-label="カード表示">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="テーブル表示">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-video bg-muted rounded-lg mb-3" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : assets.length > 0 ? (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <Link
                  key={asset.id}
                  to={`/assets/${asset.id}`}
                  className="group block"
                  onClick={() => trackClick('asset-card-click', 'assets-grid')}
                >
                  <Card className="border hover:shadow-lg transition-all duration-300 group-hover:border-primary/50 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted overflow-hidden">
                        {asset.previewUrl && (
                          <img
                            src={asset.previewUrl}
                            alt={asset.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                          {asset.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {asset.category && (
                            <Badge variant="secondary" className="text-xs">
                              {categoryInfo[asset.category as Category]?.icon} {asset.category}
                            </Badge>
                          )}
                          <Badge variant="outline" className={licensePresetInfo[asset.licensePreset].color}>
                            {licensePresetInfo[asset.licensePreset].label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatFileSize(asset.size)}</span>
                          <span>{formatDate(asset.createdAt)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="card-gradient border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-semibold">素材</th>
                        <th className="p-4 font-semibold">カテゴリ</th>
                        <th className="p-4 font-semibold">ライセンス</th>
                        <th className="p-4 font-semibold">サイズ</th>
                        <th className="p-4 font-semibold">作成日</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((asset) => (
                        <tr
                          key={asset.id}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4">
                            <Link
                              to={`/assets/${asset.id}`}
                              className="flex items-center gap-3 hover:text-primary transition-colors"
                              onClick={() => trackClick('asset-table-click', 'assets-table')}
                            >
                              <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                {asset.previewUrl && (
                                  <img
                                    src={asset.previewUrl}
                                    alt={asset.title}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{asset.title}</div>
                                {asset.description && (
                                  <div className="text-sm text-muted-foreground line-clamp-1">
                                    {asset.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className="p-4">
                            {asset.category && (
                              <Badge variant="secondary">
                                {categoryInfo[asset.category as Category]?.icon} {asset.category}
                              </Badge>
                            )}
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={licensePresetInfo[asset.licensePreset].color}>
                              {licensePresetInfo[asset.licensePreset].label}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatFileSize(asset.size)}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDate(asset.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateSearchParams({ page: page.toString() })}
              />
            </div>
          )}
        </>
      ) : (
        <Card className="card-gradient border-0">
          <CardContent className="p-12 text-center">
            <FileImage className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">素材が見つかりません</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory || selectedLicense
                ? '検索条件を変更してもう一度お試しください'
                : 'まだ素材がアップロードされていません'}
            </p>
            <div className="flex justify-center gap-4">
              {(searchQuery || selectedCategory || selectedLicense) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    updateSearchParams({
                      search: undefined,
                      category: undefined,
                      license: undefined,
                    });
                  }}
                >
                  フィルターをクリア
                </Button>
              )}
              <Button
                className="hero-gradient hover:opacity-90 transition-opacity"
                asChild
              >
                <Link to="/dashboard?upload=true">
                  <Upload className="mr-2 h-4 w-4" />
                  素材をアップロード
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Assets;