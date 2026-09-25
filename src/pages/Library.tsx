import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { PromptCard } from '../components/marketplace/PromptCard';
import { EmptyState } from '../components/common/EmptyState';
import { Prompt } from '../types';

interface LibraryProps {
  onNavigate: (path: string) => void;
  onOpenPrompt: (prompt: Prompt) => void;
}

export const Library: React.FC<LibraryProps> = ({ onNavigate, onOpenPrompt }) => {
  const { user } = useAuth();
  const { prompts, purchases, favorites } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'all' | 'purchased' | 'free' | 'favorites'>('all');

  // Filter items by tab
  const purchasedPrompts = prompts.filter((p) =>
    purchases.some((pur) => pur.prompt_id === p.id)
  );

  const freePrompts = prompts.filter(
    (p) => p.access_type === 'free' || p.price === 0
  );

  const favoritePrompts = prompts.filter((p) =>
    favorites.some((f) => f.prompt_id === p.id)
  );

  let displayedPrompts: Prompt[] = [];
  if (activeTab === 'all') {
    // Union of purchased + favorites
    const set = new Set([...purchasedPrompts.map((p) => p.id), ...favoritePrompts.map((p) => p.id)]);
    displayedPrompts = prompts.filter((p) => set.has(p.id));
    if (displayedPrompts.length === 0) {
      displayedPrompts = purchasedPrompts;
    }
  } else if (activeTab === 'purchased') {
    displayedPrompts = purchasedPrompts;
  } else if (activeTab === 'free') {
    displayedPrompts = freePrompts;
  } else if (activeTab === 'favorites') {
    displayedPrompts = favoritePrompts;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Customer Collection
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111111]">
            My Library
          </h1>
          <p className="text-xs sm:text-sm text-[#666666]">
            Your unlocked commercial prompt licenses and saved bookmarks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/explore')}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
        >
          Discover More Prompts
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E7E7E3] rounded-xl w-fit">
        {[
          { id: 'all', label: 'All Saved' },
          { id: 'purchased', label: `Purchased (${purchasedPrompts.length})` },
          { id: 'free', label: `Free Prompts (${freePrompts.length})` },
          { id: 'favorites', label: `Favorites (${favoritePrompts.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#111111] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#111111]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayedPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onOpenPrompt={onOpenPrompt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={activeTab === 'purchased' ? 'No purchased prompts yet' : 'Your library is empty'}
          description="Discover your first prompt and start building with production-ready AI instructions."
          actionText="Explore Prompts"
          onAction={() => onNavigate('/explore')}
          icon={activeTab === 'favorites' ? 'heart' : 'folder'}
        />
      )}
    </div>
  );
};
