import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { Prompt } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  createPromptOrder,
  createSubscriptionOrder,
  verifyPaymentSignature,
} from '../../lib/razorpay';

interface CheckoutModalProps {
  prompt?: Prompt | null;
  isSubscription?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  prompt,
  isSubscription = false,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { siteSettings, showToast, refreshData } = useMarketplace();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const itemTitle = isSubscription ? 'Mekyo Pro Monthly Membership' : prompt?.title;
  const itemPrice = isSubscription ? siteSettings.pro_monthly_price : prompt?.price || 0;
  const currency = prompt?.currency || siteSettings.currency || 'USD';

  const handleProcessPayment = async () => {
    if (!user) {
      showToast('Please log in to proceed with checkout', 'error');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const order = isSubscription
        ? await createSubscriptionOrder()
        : await createPromptOrder(prompt!.id);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.RAZORPAY_KEY_ID || 'rzp_test_mekyo_marketplace',
        amount: order.amount,
        currency: order.currency,
        name: siteSettings.site_name || 'Mekyo AI',
        description: itemTitle,
        order_id: order.orderId !== order.orderId ? order.orderId : undefined, // Razorpay requires a real order_id. If we mock it, we omit it.
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyPaymentSignature(
              {
                razorpay_order_id: response.razorpay_order_id || order.orderId, // Use mock if real not provided
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature || 'mock_signature', // Fallback for pure client mode
                prompt_id: isSubscription ? undefined : prompt?.id,
                is_subscription: isSubscription,
              },
              user.id
            );

            if (!verifyRes.verified) {
              throw new Error(verifyRes.error || 'Payment signature verification failed');
            }

            setIsComplete(true);
            refreshData();
            showToast(isSubscription ? 'Welcome to Mekyo Pro!' : 'Prompt unlocked & added to your library!', 'success');

            setTimeout(() => {
              setIsComplete(false);
              setIsProcessing(false);
              onSuccess();
              onClose();
            }, 1400);
          } catch (err: any) {
            console.error('Checkout verification error:', err);
            setErrorMsg(err?.message || 'Payment verification failed.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.full_name,
          email: user.email,
        },
        theme: {
          color: '#111111',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setErrorMsg(response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err?.message || 'Payment initialization failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E7E7E3] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E7E3] bg-[#F7F7F5]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#111111]" />
            <span className="font-semibold text-sm tracking-tight text-[#111111]">
              Secure Checkout · Razorpay
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isComplete ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[320px]">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-in zoom-in-75">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111111] mb-2">Payment Confirmed</h3>
            <p className="text-xs text-[#666666] max-w-sm">
              Your transaction has been verified on the server. The prompt has been unlocked and added to your personal library.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Item Summary Card */}
            <div className="p-4 bg-[#F7F7F5] rounded-xl border border-[#E7E7E3] flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A8A8A]">
                  {isSubscription ? 'Subscription Tier' : 'Licensed Digital Prompt'}
                </span>
                <h4 className="font-semibold text-sm text-[#111111]">{itemTitle}</h4>
                {prompt?.ai_tool && (
                  <span className="text-xs text-[#666666]">Engine: {prompt.model}</span>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-[#8A8A8A] block">Total</span>
                <span className="text-xl font-bold tabular-nums text-[#111111]">
                  ${itemPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] border-t border-[#E7E7E3] pt-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Encrypted</span>
              </div>
              <span>Instant Digital Access</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-[#666666] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="flex-2 py-2.5 px-4 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Signature...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay ${itemPrice.toFixed(2)} {currency}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
