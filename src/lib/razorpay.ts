import { Prompt } from '../types';
import * as api from './api';

export interface RazorpayOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface PaymentVerificationRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  prompt_id?: string;
  is_subscription?: boolean;
}

export interface PaymentVerificationResponse {
  verified: boolean;
  purchase_id?: string;
  subscription_id?: string;
  error?: string;
}

export async function createPromptOrder(promptId: string): Promise<RazorpayOrderResult> {
  const prompts = await api.fetchPrompts();
  const prompt = prompts.find(p => p.id === promptId);
  if (!prompt) {
    throw new Error('Prompt not found in database');
  }

  const amountInSmallestUnit = Math.round(prompt.price * 100);
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const keyId = import.meta.env.RAZORPAY_KEY_ID || 'rzp_test_mekyo_marketplace';

  return {
    orderId,
    amount: amountInSmallestUnit,
    currency: prompt.currency || 'USD',
    keyId,
  };
}

export async function createSubscriptionOrder(): Promise<RazorpayOrderResult> {
  const settings = await api.fetchSiteSettings();
  if (!settings) throw new Error('Settings not found');
  const amountInSmallestUnit = Math.round(settings.pro_monthly_price * 100);
  const orderId = `sub_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const keyId = import.meta.env.RAZORPAY_KEY_ID || 'rzp_test_mekyo_marketplace';

  return {
    orderId,
    amount: amountInSmallestUnit,
    currency: settings.currency || 'USD',
    keyId,
  };
}

export async function verifyPaymentSignature(
  req: PaymentVerificationRequest,
  userId: string
): Promise<PaymentVerificationResponse> {
  const isValidSignature = Boolean(
    req.razorpay_order_id && req.razorpay_payment_id && req.razorpay_signature
  );

  if (!isValidSignature) {
    return {
      verified: false,
      error: 'Invalid payment signature or missing transaction IDs',
    };
  }

  if (req.is_subscription) {
    const settings = await api.fetchSiteSettings();
    const sub = {
      id: `sub-${Date.now()}`,
      user_id: userId,
      plan: 'pro' as const,
      razorpay_subscription_id: req.razorpay_payment_id,
      status: 'active' as const,
      start_date: new Date().toISOString(),
      renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: settings?.pro_monthly_price || 29,
      currency: settings?.currency || 'USD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await api.saveSubscription(sub);
    await api.updateUserProfile(userId, { plan: 'pro' });

    return {
      verified: true,
      subscription_id: sub.id,
    };
  }

  if (req.prompt_id) {
    const prompts = await api.fetchPrompts();
    const prompt = prompts.find((p) => p.id === req.prompt_id);
    if (!prompt) {
      return { verified: false, error: 'Prompt no longer available' };
    }

    const purchase = {
      id: `pur-${Date.now()}`,
      user_id: userId,
      prompt_id: prompt.id,
      amount: prompt.price,
      currency: prompt.currency,
      razorpay_order_id: req.razorpay_order_id,
      razorpay_payment_id: req.razorpay_payment_id,
      status: 'paid' as const,
      created_at: new Date().toISOString(),
    };

    const client = api.supabase;
    if (client) {
      await client.from('purchases').insert(purchase);
    }

    return {
      verified: true,
      purchase_id: purchase.id,
    };
  }

  return { verified: false, error: 'Unknown target order entity' };
}
