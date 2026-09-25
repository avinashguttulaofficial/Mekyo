import React from 'react';
import { BookOpen, Heart, ShoppingBag, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { PromptCard } from '../components/marketplace/PromptCard';
import { Prompt } from '../types';

interface DashboardProps {
  onNavigate: (path: string) => void;
  onOpenPrompt: (prompt: Prompt) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onOpenPrompt }) => {
  const { user, isPro } = useAuth();
  const { prompts, purchases, favorites } = useMarketplace();

  // User stats
  const purchasedCount = purchases.length;
  const favoritesCount = favorites.length;
  const freePromptsCount = prompts.filter((p) => p.access_type === 'free' || p.price === 0).length;

  // Recently unlocked/purchased prompts
  const userPurchasedPrompts = prompts.filter((p) =>
    purchases.some((pur) => pur.prompt_id === p.id)
  );

  // Recommended prompts (featured and not yet purchased)
  const recommendedPrompts = prompts
    .filter((p) => !purchases.some((pur) => pur.prompt_id === p.id))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Customer Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111111]">
            Welcome back, {user?.full_name || 'Creator'}
          </h1>
          <p className="text-xs sm:text-sm text-[#666666]">
            Your prompt library at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/library')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Open My Library
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#8A8A8A] mb-2">
            <span className="text-xs font-medium">Purchased Prompts</span>
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[#111111]">
            {purchasedCount}
          </span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#8A8A8A] mb-2">
            <span className="text-xs font-medium">Free Library Prompts</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[#111111]">
            {freePromptsCount}
          </span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#8A8A8A] mb-2">
            <span className="text-xs font-medium">Saved Favorites</span>
            <Heart className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold tabular-nums text-[#111111]">
            {favoritesCount}
          </span>
        </div>

        <div className="p-5 bg-white border border-[#E7E7E3] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#8A8A8A] mb-2">
            <span className="text-xs font-medium">Current Plan</span>
            <Sparkles className="w-4 h-4 text-[#B8FF3D]" />
          </div>
          <span className="text-2xl font-bold capitalize text-[#111111]">
            {user?.plan || 'Free'}
          </span>
        </div>
      </div>

      {/* Recently Unlocked */}
      {userPurchasedPrompts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">
              Recently Unlocked
            </h2>
            <button
              onClick={() => onNavigate('/library')}
              className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {userPurchasedPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} onOpenPrompt={onOpenPrompt} />
            ))}
          </div>
        </section>
      )}

      {/* Recommended Prompts */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">
              Recommended for You
            </h2>
            <p className="text-xs text-[#666666]">
              Hand-picked verified workflows to accelerate your generation pipelines.
            </p>
          </div>
          <button
            onClick={() => onNavigate('/explore')}
            className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1"
          >
            <span>Continue Exploring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onOpenPrompt={onOpenPrompt} />
          ))}
        </div>
      </section>
    </div>
  );
};
