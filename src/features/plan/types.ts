// Re-export from collab types to avoid circular dependencies
export type {
  Plan,
  Quota,
  IncentiveStatus,
} from '../collab/types';

export { getQuotaForPlan } from '../collab/types';

// Notification types for plan changes
export type PlanNotification = {
  id: string;
  type: 'sns_boost_granted' | 'invite_bonus_granted' | 'plan_upgraded';
  title: string;
  message: string;
  showConfetti?: boolean;
  createdAt: string;
  read: boolean;
};

// Achievement types for celebrations
export type Achievement = {
  id: string;
  type: 'first_sns_boost' | 'first_invite' | 'first_upgrade';
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
};