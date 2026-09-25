import { Prompt, Purchase, Subscription, UserProfile } from '../types';

export interface AccessCheckResult {
  canAccess: boolean;
  reason?: 'not_logged_in' | 'requires_purchase' | 'requires_pro' | 'granted';
  message?: string;
}

/**
 * Authoritative access check for a prompt
 * FREE: Logged-in user can access
 * PAID: User must have purchased the prompt
 * PRO: User must have active Pro subscription (or have purchased it directly)
 * ADMIN: Admin can access all prompts
 */
export function canAccessPrompt(
  user: UserProfile | null,
  prompt: Prompt,
  userPurchases: Purchase[] = [],
  userSubscriptions: Subscription[] = []
): AccessCheckResult {
  // If not logged in, cannot access the full prompt
  if (!user) {
    return {
      canAccess: false,
      reason: 'not_logged_in',
      message: 'Sign in to access prompt',
    };
  }

  // Admin has access to everything
  if (user.role === 'admin') {
    return { canAccess: true, reason: 'granted' };
  }

  // Suspended users have no access
  if (user.status === 'suspended') {
    return {
      canAccess: false,
      reason: 'requires_purchase',
      message: 'Your account is suspended',
    };
  }

  // Free prompts are accessible to any active logged-in user
  if (prompt.access_type === 'free' || prompt.price === 0) {
    return { canAccess: true, reason: 'granted' };
  }

  // Direct purchase grant
  const hasPurchased = userPurchases.some(
    (p) => p.prompt_id === prompt.id && p.status === 'paid'
  );
  if (hasPurchased) {
    return { canAccess: true, reason: 'granted' };
  }

  // Pro tier check
  const hasActiveProSub = user.plan === 'pro' || userSubscriptions.some((s) => s.status === 'active');
  if (prompt.access_type === 'pro' && hasActiveProSub) {
    return { canAccess: true, reason: 'granted' };
  }

  // If prompt is paid, must purchase
  if (prompt.access_type === 'paid') {
    return {
      canAccess: false,
      reason: 'requires_purchase',
      message: `Purchase for $${prompt.price.toFixed(2)} to unlock`,
    };
  }

  // If prompt is pro, requires pro subscription
  if (prompt.access_type === 'pro') {
    return {
      canAccess: false,
      reason: 'requires_pro',
      message: 'Upgrade to Mekyo Pro to unlock',
    };
  }

  return { canAccess: false, reason: 'requires_purchase' };
}
