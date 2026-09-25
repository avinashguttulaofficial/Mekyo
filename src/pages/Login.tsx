import React, { useState } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';

interface LoginProps {
  onNavigate: (path: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { showToast } = useMarketplace();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Logged in successfully', 'success');
      if (email.toLowerCase().includes('admin')) {
        onNavigate('/admin');
      } else {
        onNavigate('/dashboard');
      }
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  // const handleQuickAdmin = () => {
  //   setEmail('admin@mekyo.ai');
  //   setPassword('admin123');
  // };

  // const handleQuickUser = () => {
  //   setEmail('user@example.com');
  //   setPassword('user123');
  // };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
          Sign in to Mekyo
        </h1>
        <p className="text-xs text-[#666666]">
          Access your purchased prompts, favorites, and customer library.
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        {/* Quick Demo Fill Buttons */}
        <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs">
          <span className="text-[#8A8A8A] font-medium">Quick Credentials:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              // onClick={handleQuickUser}
              className="px-2 py-1 bg-white border border-[#E7E7E3] rounded text-[11px] font-semibold text-[#111111] hover:bg-neutral-100 cursor-pointer"
            >
              User
            </button>
            <button
              type="button"
              // onClick={handleQuickAdmin}
              className="px-2 py-1 bg-[#111111] text-white rounded text-[11px] font-semibold hover:bg-black cursor-pointer"
            >
              Pro
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#111111] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-[11px] text-[#666666] hover:text-[#111111] underline cursor-pointer"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder=""
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
            {isLoading ? <span>Signing in...</span> : <span>Sign In</span>}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#666666]">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/signup')}
            className="font-semibold text-[#111111] hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};
