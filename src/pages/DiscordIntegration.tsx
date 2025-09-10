import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings,
  ExternalLink,
  CheckCircle,
  XCircle,
  Users,
  MessageSquare,
  Info
} from 'lucide-react';
import { discordService } from '@/features/overlay/services/discord';
import { DiscordLink } from '@/features/overlay/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const DiscordIntegration = () => {
  const [discordLink, setDiscordLink] = useState<DiscordLink>({ linked: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);

  useEffect(() => {
    const loadDiscordLink = async () => {
      try {
        const link = await discordService.getLink();
        setDiscordLink(link);
      } catch (error) {
        toast.error('Discord連携状態の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadDiscordLink();
  }, []);

  const handleLinkAccount = async () => {
    setIsLinking(true);
    try {
      await discordService.linkAccount();
      const updatedLink = await discordService.getLink();
      setDiscordLink(updatedLink);
      toast.success('Discordアカウントを連携しました');
    } catch (error) {
      toast.error('Discord連携に失敗しました');
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkAccount = async () => {
    setIsUnlinking(true);
    try {
      await discordService.unlinkAccount();
      setDiscordLink({ linked: false });
      toast.success('Discordアカウントの連携を解除しました');
    } catch (error) {
      toast.error('連携解除に失敗しました');
    } finally {
      setIsUnlinking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center">
          <Settings className="mr-3 h-8 w-8" />
          Discord連携設定
        </h1>
        <p className="text-muted-foreground">
          Discordと連携してオーバーレイ機能を使用できます
        </p>
      </div>

      {/* Main Integration Card */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Discordアカウント連携
              </CardTitle>
              <CardDescription>
                通話メンバーの表示とオーバーレイ生成に必要です
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {discordLink.linked ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  連携済み
                </Badge>
              ) : (
                <Badge variant="outline">
                  <XCircle className="mr-1 h-3 w-3" />
                  未連携
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {discordLink.linked ? (
            /* Linked State */
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="https://via.placeholder.com/48x48?text=DC" />
                  <AvatarFallback>DC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{discordLink.accountName}</div>
                  <div className="text-sm text-muted-foreground">
                    連携日: {discordLink.linkedAt ? 
                      new Date(discordLink.linkedAt).toLocaleDateString('ja-JP') 
                      : '不明'
                    }
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUnlinkAccount}
                  disabled={isUnlinking}
                >
                  {isUnlinking ? '解除中...' : '連携解除'}
                </Button>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  連携が完了しました！コラボページからオーバーレイを生成できます。
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            /* Not Linked State */
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Discordと連携すると、通話メンバーを自動取得してOBS用オーバーレイを生成できます。
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h3 className="font-medium">連携でできること:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    サーバー・チャンネル一覧の表示
                  </li>
                  <li className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    通話中メンバーの自動取得
                  </li>
                  <li className="flex items-center">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    OBS用オーバーレイの生成
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleLinkAccount}
                  disabled={isLinking}
                  className="hero-gradient hover:opacity-90"
                >
                  {isLinking ? '連携中...' : 'Discordと連携する'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Overview */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle>オーバーレイ機能について</CardTitle>
          <CardDescription>
            Discord連携後に使用できる機能の紹介
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">まとめて表示</h3>
              <p className="text-sm text-muted-foreground">
                すべてのメンバーを1つのオーバーレイに表示します。グリッドまたはリスト形式で配置できます。
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">個別表示</h3>
              <p className="text-sm text-muted-foreground">
                メンバーごとに個別のオーバーレイを生成します。各メンバーの素材を個別にカスタマイズできます。
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">コラボでオーバーレイを使う</h3>
                <p className="text-sm text-muted-foreground">
                  既存のコラボからオーバーレイを生成してみましょう
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/collabs">
                  コラボ一覧へ
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscordIntegration;