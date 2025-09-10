import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Sparkles } from 'lucide-react';
import { Plan, Quota } from '../types';

interface QuotaDisplayProps {
  plan: Plan;
  quota: Quota;
  currentCount: number;
  type: 'assets' | 'collabs';
  className?: string;
}

export const QuotaDisplay: React.FC<QuotaDisplayProps> = ({
  plan,
  quota,
  currentCount,
  type,
  className = '',
}) => {
  const maxCount = type === 'assets' ? quota.assetMax : quota.collabMax;
  const isPaid = plan === 'PAID';
  const isUnlimited = maxCount === Infinity;
  
  const progress = isUnlimited ? 100 : Math.min((currentCount / maxCount) * 100, 100);
  const isNearLimit = !isUnlimited && progress >= 80;
  const isAtLimit = !isUnlimited && currentCount >= maxCount;

  if (isPaid) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Crown className="h-4 w-4 text-yellow-500" />
        <Badge variant="outline" className="border-yellow-500 text-yellow-700 dark:text-yellow-400">
          無制限
        </Badge>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {type === 'assets' ? '素材' : 'コラボ'}使用量
        </span>
        <div className="flex items-center gap-2">
          <span className={isAtLimit ? 'text-destructive' : isNearLimit ? 'text-orange-600' : ''}>
            {currentCount}/{isUnlimited ? '∞' : maxCount}
          </span>
          {isNearLimit && !isAtLimit && (
            <Sparkles className="h-3 w-3 text-orange-500" />
          )}
        </div>
      </div>
      
      {!isUnlimited && (
        <Progress 
          value={progress} 
          className={`h-2 ${isAtLimit ? 'bg-destructive/20' : isNearLimit ? 'bg-orange-100' : ''}`}
        />
      )}
      
      {isAtLimit && (
        <p className="text-xs text-destructive">
          上限に達しています。アーカイブまたはプラン変更をご検討ください。
        </p>
      )}
      
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-orange-600">
          もうすぐ上限です。プラン変更で無制限にできます。
        </p>
      )}
    </div>
  );
};