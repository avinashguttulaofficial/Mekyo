import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { supabase } from '../lib/supabase';

interface ResetPasswordProps {
  onNavigate: (path: string) => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigate }) => {
  const { updatePassword } = useAuth();
  const { showToast } = useMarketplace();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if the user arrived here with a valid recovery session
    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setHasValidSession(true);
      } else {
        // If there's a hash in the URL, Supabase might be processing it
        if (window.location.hash) {
          const { data: { session: hashSession } } = await supabase.auth.getSession();
          if (hashSession) setHasValidSession(true);
        }
      }
      setIsChecking(false);
    };
    
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await updatePassword(password);
    setIsSubmitting(false);

    if (res.success) {
      setSuccess(true);
      showToast('Password updated successfully', 'success');
    } else {
      setError(res.error || 'Failed to update password');
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-neutral-200 border-t-[#111111] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Create New Password
        </h1>
        <p className="text-xs text-[#666666]">
          Enter your new password below to secure your account.
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        {!hasValidSession && !success ? (
          <div className="text-center py-6 space-y-4">
            <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
              Invalid or expired password reset link.
            </div>
            <p className="text-xs text-[#666666]">
              Please request a new password reset link.
            </p>
            <button
              onClick={() => onNavigate('/forgot-password')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-[#111111] bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              Request New Link
            </button>
          </div>
        ) : success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">Password Updated!</h3>
            <p className="text-xs text-[#666666]">
              Your password has been successfully reset.
            </p>
            <button
              onClick={() => onNavigate('/dashboard')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-[#111111] rounded-lg cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Must match new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
