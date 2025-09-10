import { useState, useEffect } from 'react';
import { Quota, Plan, IncentiveStatus } from '../types';
import { quotaApi } from '../services/quota';
import { toast } from 'sonner';

export interface QuotaHook {
  quota: Quota | null;
  plan: Plan;
  incentiveStatus: IncentiveStatus;
  isLoading: boolean;
  checkAssetQuota: (currentCount: number) => Promise<boolean>;
  checkCollabQuota: (currentCount: number) => Promise<boolean>;
  grantSnsBoost: () => Promise<void>;
  grantInviteBonus: () => Promise<void>;
  upgradeToPaid: () => Promise<void>;
  refreshQuota: () => Promise<void>;
}

export const useQuota = (): QuotaHook => {
  const [quota, setQuota] = useState<Quota | null>(null);
  const [plan, setPlan] = useState<Plan>('FREE');
  const [incentiveStatus, setIncentiveStatus] = useState<IncentiveStatus>({
    snsBoostGranted: false,
    invitesGranted: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshQuota = async () => {
    try {
      setIsLoading(true);
      const [userPlan, currentQuota] = await Promise.all([
        quotaApi.getUserPlan(),
        quotaApi.getCurrentQuota(),
      ]);
      
      setPlan(userPlan.plan);
      setIncentiveStatus(userPlan.incentiveStatus);
      setQuota(currentQuota);
    } catch (error) {
      console.error('Failed to load quota:', error);
      toast.error('プラン情報の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshQuota();
  }, []);

  const checkAssetQuota = async (currentCount: number): Promise<boolean> => {
    try {
      const result = await quotaApi.checkAssetQuota(currentCount);
      return result.canAdd;
    } catch (error) {
      console.error('Failed to check asset quota:', error);
      return false;
    }
  };

  const checkCollabQuota = async (currentCount: number): Promise<boolean> => {
    try {
      const result = await quotaApi.checkCollabQuota(currentCount);
      return result.canAdd;
    } catch (error) {
      console.error('Failed to check collab quota:', error);
      return false;
    }
  };

  const grantSnsBoost = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await quotaApi.grantSnsBoost();
      
      // Show celebration
      toast.success('🎉 おめでとう！素材枠が 5 → 10件 に倍増しました！', {
        duration: 5000,
      });
      
      // Trigger confetti (will be implemented in component)
      const event = new CustomEvent('showConfetti', { 
        detail: { type: 'snsBoost' } 
      });
      window.dispatchEvent(event);
      
      await refreshQuota();
    } catch (error) {
      console.error('Failed to grant SNS boost:', error);
      toast.error(error instanceof Error ? error.message : 'SNSブースト特典の付与に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const grantInviteBonus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await quotaApi.grantInviteBonus();
      
      toast.success('✨ 友達が参加しました！コラボリスト枠が +1件 になりました！', {
        duration: 5000,
      });
      
      const event = new CustomEvent('showConfetti', { 
        detail: { type: 'invite' } 
      });
      window.dispatchEvent(event);
      
      await refreshQuota();
    } catch (error) {
      console.error('Failed to grant invite bonus:', error);
      toast.error(error instanceof Error ? error.message : '招待特典の付与に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToPaid = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await quotaApi.upgradeToPaid();
      
      toast.success('🚀 プレミアムにアップグレード！素材もコラボも 無制限 になりました！', {
        duration: 5000,
      });
      
      const event = new CustomEvent('showConfetti', { 
        detail: { type: 'upgrade' } 
      });
      window.dispatchEvent(event);
      
      await refreshQuota();
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      toast.error('プランのアップグレードに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    quota,
    plan,
    incentiveStatus,
    isLoading,
    checkAssetQuota,
    checkCollabQuota,
    grantSnsBoost,
    grantInviteBonus,
    upgradeToPaid,
    refreshQuota,
  };
};