import React, { useState } from 'react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';

interface ForgotPasswordProps {
  onNavigate: (path: string) => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const { showToast } = useMarketplace();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    const result = await resetPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setSent(true);
      showToast('Password reset link sent to your email', 'info');
    } else {
      showToast(result.error || 'Failed to send reset link', 'error');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Reset Password
        </h1>
        <p className="text-xs text-[#666666]">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        {sent ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">Reset Link Dispatched</h3>
            <p className="text-xs text-[#666666]">
              If an account exists for {email}, you will receive an email shortly with reset instructions.
            </p>
            <button
              onClick={() => onNavigate('/login')}
              className="mt-4 text-xs font-semibold text-[#111111] hover:underline"
            >
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('/login')}
            className="inline-flex items-center gap-1.5 text-xs text-[#666666] hover:text-[#111111]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </button>
        </div>
      </div>
    </div>
  );
};
