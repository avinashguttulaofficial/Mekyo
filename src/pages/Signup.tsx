import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';

interface SignupProps {
  onNavigate: (path: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const { showToast } = useMarketplace();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setIsLoading(true);
    setError(null);

    const res = await signup(email, password, fullName);
    setIsLoading(false);

    if (res.success && !res.error) {
      showToast('Account created successfully! Welcome to Mekyo.', 'success');
      onNavigate('/dashboard');
    } else if (res.error === 'confirmation_required') {
      setNeedsConfirmation(true);
    } else {
      setError(res.error || 'Failed to create account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Create your Mekyo account
        </h1>
        <p className="text-xs text-[#666666]">
          Unlock free prompts, save your favorites, and manage your commercial licenses.
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        {needsConfirmation ? (
          <div className="text-center py-6 space-y-3">
            <h3 className="text-base font-bold text-[#111111]">Verify your email</h3>
            <p className="text-xs text-[#666666]">
              We've sent a confirmation link to <strong>{email}</strong>. Please check your inbox and click the link to activate your account.
            </p>
            <button
              onClick={() => onNavigate('/login')}
              className="mt-4 text-xs font-semibold text-[#111111] hover:underline"
            >
              Go to sign in
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Lin"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#E7E7E3] rounded-xl focus:outline-none focus:border-[#111111]"
                />
              </div>

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

              <div>
                <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1">
                  Password
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {isLoading ? <span>Creating Account...</span> : <span>Create Account</span>}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-[#666666]">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('/login')}
                className="font-semibold text-[#111111] hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
