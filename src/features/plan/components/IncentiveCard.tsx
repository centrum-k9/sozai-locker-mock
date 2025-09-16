import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Twitter, 
  Gift, 
  Check, 
  ExternalLink,
  Users,
  Sparkles,
  Target
} from 'lucide-react';
import { IncentiveStatus } from '../types';

interface IncentiveCardProps {
  incentiveStatus: IncentiveStatus;
  onGrantSnsBoost?: () => void;
  onGrantInviteBonus?: () => void;
  isLoading?: boolean;
}

export const IncentiveCard: React.FC<IncentiveCardProps> = ({
  incentiveStatus,
  onGrantSnsBoost,
  onGrantInviteBonus,
  isLoading = false,
}) => {
  const maxInvites = 3;
  const invitesRemaining = maxInvites - incentiveStatus.invitesGranted;

  return (
    <div className="space-y-4">
      {/* SNS投稿特典 */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Twitter className="mr-2 h-5 w-5 text-blue-500" />
            SNS投稿特典
            {incentiveStatus.snsBoostGranted && (
              <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100">
                <Check className="mr-1 h-3 w-3" />
                取得済み
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            「#ラクコラ」を付けて導入感想をXに投稿すると素材枠が倍増
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Gift className="mr-2 h-4 w-4 text-primary" />
                特典内容
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• 素材枠が 5 → 10件 に倍増</div>
                <div>• 1回限りの特典</div>
                <div>• 投稿内容を自動で検知</div>
              </div>
            </div>
            
            <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4">
              <h4 className="font-medium mb-2">投稿例</h4>
              <div className="text-sm italic text-muted-foreground bg-background/50 rounded p-3">
                「ラクコラ、VTuber仲間との素材共有がめちゃくちゃ便利！
                コラボ準備がサクサク進む ✨ #ラクコラ」
              </div>
            </div>

            {!incentiveStatus.snsBoostGranted ? (
              <div className="flex gap-2">
                <Button
                  onClick={onGrantSnsBoost}
                  disabled={isLoading}
                  className="hero-gradient hover:opacity-90"
                  asChild
                >
                  <a 
                    href="https://x.com/intent/tweet?text=ラクコラ、VTuber仲間との素材共有がめちゃくちゃ便利！%0aコラボ準備がサクサク進む ✨ %23ラクコラ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Xで投稿する
                  </a>
                </Button>
                <Button
                  onClick={onGrantSnsBoost}
                  disabled={isLoading}
                  variant="outline"
                >
                  投稿完了（テスト）
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">特典は既に受け取り済みです</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 招待特典 */}
      <Card className="card-gradient border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Users className="mr-2 h-5 w-5 text-purple-500" />
            友達招待特典
            <Badge variant="outline" className="ml-2">
              {incentiveStatus.invitesGranted}/{maxInvites}回
            </Badge>
          </CardTitle>
          <CardDescription>
            招待リンクから友達が登録するとコラボ枠が増加
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Target className="mr-2 h-4 w-4 text-primary" />
                特典内容
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• 1人招待ごとにコラボ枠 +1</div>
                <div>• 最大3名まで招待可能（5 → 8件）</div>
                <div>• 招待された友達にも初回特典</div>
              </div>
            </div>

            {invitesRemaining > 0 ? (
              <div className="flex gap-2">
                <Button
                  disabled={isLoading}
                  className="hero-gradient hover:opacity-90"
                >
                  <Users className="mr-2 h-4 w-4" />
                  招待リンクを作成
                </Button>
                <Button
                  onClick={onGrantInviteBonus}
                  disabled={isLoading}
                  variant="outline"
                >
                  招待成功（テスト）
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">招待特典の上限に達しました</span>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              残り招待可能数: {invitesRemaining}回
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};