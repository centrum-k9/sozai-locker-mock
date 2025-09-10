import { Plan, Quota, IncentiveStatus, getQuotaForPlan } from '../types';

// プラン関連の型定義
export type UserPlan = {
  plan: Plan;
  incentiveStatus: IncentiveStatus;
  createdAt: string;
  updatedAt?: string;
};

// モックストレージ
let userPlanStore: UserPlan = {
  plan: 'FREE',
  incentiveStatus: {
    snsBoostGranted: false,
    invitesGranted: 0,
  },
  createdAt: '2024-01-01T00:00:00Z',
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const quotaApi = {
  async getUserPlan(): Promise<UserPlan> {
    await delay(200);
    return { ...userPlanStore };
  },

  async getCurrentQuota(): Promise<Quota> {
    await delay(200);
    return getQuotaForPlan(userPlanStore.plan, userPlanStore.incentiveStatus);
  },

  async grantSnsBoost(): Promise<UserPlan> {
    await delay(500);
    if (userPlanStore.incentiveStatus.snsBoostGranted) {
      throw new Error('SNSブースト特典は既に受け取り済みです');
    }
    
    userPlanStore.incentiveStatus.snsBoostGranted = true;
    userPlanStore.updatedAt = new Date().toISOString();
    
    return { ...userPlanStore };
  },

  async grantInviteBonus(): Promise<UserPlan> {
    await delay(500);
    const maxInvites = 3;
    
    if (userPlanStore.incentiveStatus.invitesGranted >= maxInvites) {
      throw new Error('招待特典は上限に達しています');
    }
    
    userPlanStore.incentiveStatus.invitesGranted += 1;
    userPlanStore.updatedAt = new Date().toISOString();
    
    return { ...userPlanStore };
  },

  async upgradeToPaid(): Promise<UserPlan> {
    await delay(1000);
    userPlanStore.plan = 'PAID';
    userPlanStore.updatedAt = new Date().toISOString();
    
    return { ...userPlanStore };
  },

  // 使用量チェック
  async checkAssetQuota(currentCount: number): Promise<{ canAdd: boolean; quota: Quota }> {
    await delay(100);
    const quota = getQuotaForPlan(userPlanStore.plan, userPlanStore.incentiveStatus);
    
    return {
      canAdd: currentCount < quota.assetMax,
      quota,
    };
  },

  async checkCollabQuota(currentCount: number): Promise<{ canAdd: boolean; quota: Quota }> {
    await delay(100);
    const quota = getQuotaForPlan(userPlanStore.plan, userPlanStore.incentiveStatus);
    
    return {
      canAdd: currentCount < quota.collabMax,
      quota,
    };
  },
};