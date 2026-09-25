import React, { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { CheckoutModal } from '../components/marketplace/CheckoutModal';

interface PricingProps {
  onNavigate: (path: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const { user, isAuthenticated, isPro } = useAuth();
  const { siteSettings, showToast } = useMarketplace();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const freeFeatures = [
    'Access all free prompts with zero trial limits',
    'Save and bookmark prompts to Favorites',
    'Personal customer library and dashboard',
    'Full access to copy syntax and negative prompts',
    'Rate and review purchased prompts',
    'Personal profile and history',
  ];

  const proFeatures = [
    'Complete access to all Pro-tier exclusive prompts',
    'Full prompt library and system architecture prompts',
    'High-resolution demonstration video playback',
    'Premium multi-channel campaign blueprints',
    'Commercial exploitation license included',
    'Priority access to newly released weekly prompts',
    'Direct editorial support & prompt modification requests',
  ];

  const handleProAction = () => {
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to get Pro', 'info');
      onNavigate('/signup');
      return;
    }
    if (isPro) {
      showToast('You already have an active Mekyo Pro subscription!', 'info');
      onNavigate('/dashboard');
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16 pb-24">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Transparent Membership
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
          Simple, predictable pricing.
        </h1>
        <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
          Access verified AI prompts individually with lifetime licenses, or unlock the complete editorial collection with Mekyo Pro.
        </p>
      </div>

      {/* Pricing Cards (2 Plans Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Plan 1: FREE */}
        <div className="bg-white border border-[#E7E7E3] rounded-3xl p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111111]">Free</h3>
              <span className="text-xs font-mono text-[#8A8A8A] bg-neutral-100 px-2.5 py-0.5 rounded">
                STARTER
              </span>
            </div>
            <p className="text-xs text-[#666666] mb-6">
              Essential access for exploring free prompts and purchasing single commercial licenses.
            </p>

            <div className="mb-8">
              <span className="text-4xl font-extrabold tabular-nums text-[#111111]">$0</span>
              <span className="text-xs text-[#8A8A8A] ml-1.5">forever</span>
            </div>

            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-[#444444]">
                  <Check className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(isAuthenticated ? '/explore?price=free' : '/signup')}
            className="w-full py-3 px-4 text-xs font-semibold text-[#111111] bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
          >
            {isAuthenticated ? 'Browse Free Prompts' : 'Get Started'}
          </button>
        </div>

        {/* Plan 2: PRO */}
        <div className="relative bg-[#111111] text-white border border-neutral-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          {/* Top highlight badge */}
          <div className="absolute -top-3 right-8 bg-[#B8FF3D] text-[#111111] font-semibold text-[11px] px-3 py-0.5 rounded-full shadow-xs">
            FULL ACCESS
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Pro</h3>
                <Sparkles className="w-4 h-4 text-[#B8FF3D] fill-current" />
              </div>
              <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2.5 py-0.5 rounded">
                MEMBERSHIP
              </span>
            </div>
            <p className="text-xs text-neutral-400 mb-6">
              Unrestricted access to every exclusive prompt, commercial video generation parameters, and code suites.
            </p>

            <div className="mb-8 flex items-baseline">
              <span className="text-4xl font-extrabold tabular-nums text-white">
                ${siteSettings.pro_monthly_price}
              </span>
              <span className="text-xs text-neutral-400 ml-2">/ month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {proFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <Check className="w-4 h-4 text-[#B8FF3D] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={handleProAction}
            className="w-full py-3.5 px-4 text-xs font-semibold text-[#111111] bg-[#B8FF3D] hover:bg-[#a6ee2d] rounded-xl transition-colors cursor-pointer shadow-md"
          >
            {isPro ? 'Pro Active (Manage in Dashboard)' : 'Get Pro'}
          </button>
        </div>
      </div>

      {/* Checkout Modal for Pro Subscription */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        isSubscription={true}
        onSuccess={() => {
          showToast('Welcome to Mekyo Pro! All exclusive prompts unlocked.', 'success');
          onNavigate('/dashboard');
        }}
      />
    </div>
  );
};
