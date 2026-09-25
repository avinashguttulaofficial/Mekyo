import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Prompt } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: Prompt) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const { prompts, categories } = useMarketplace();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // toggle modal
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? prompts.filter((p) => {
        const q = query.toLowerCase();
        const cat = categories.find((c) => c.id === p.category_id);
        return (
          p.title.toLowerCase().includes(q) ||
          p.ai_tool.toLowerCase().includes(q) ||
          p.model.toLowerCase().includes(q) ||
          cat?.name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : prompts.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E7E7E3] overflow-hidden">
        {/* Search Header */}
        <div className="flex items-center px-4 border-b border-[#E7E7E3]">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search prompts by title, engine, category, or workflow..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3.5 py-4 text-sm bg-transparent border-none focus:outline-none text-[#111111] placeholder:text-neutral-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-[420px] overflow-y-auto divide-y divide-neutral-100">
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase text-[#8A8A8A]">
            {query.trim() ? `Search Results (${results.length})` : 'Popular Prompts'}
          </div>

          {results.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => {
                onSelectPrompt(prompt);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={prompt.cover_image_url}
                  alt={prompt.title}
                  className="w-10 h-10 rounded-lg object-cover bg-neutral-100 border border-[#E7E7E3] shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="overflow-hidden">
                  <h4 className="text-xs font-semibold text-[#111111] group-hover:text-black truncate">
                    {prompt.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[#8A8A8A]">
                    <span className="font-mono text-neutral-600">{prompt.ai_tool}</span>
                    <span>·</span>
                    <span>{prompt.model}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold tabular-nums text-neutral-900">
                  {prompt.price === 0 ? 'Free' : `$${prompt.price.toFixed(2)}`}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-neutral-900 transition-all" />
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="py-8 text-center text-xs text-[#8A8A8A]">
              No prompts matched "{query}". Try searching for Flux, Midjourney, or Sora.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#F7F7F5] border-t border-[#E7E7E3] text-[11px] text-[#8A8A8A] flex items-center justify-between">
          <span>Press ESC to exit</span>
          <span>Verified Mekyo AI Prompts</span>
        </div>
      </div>
    </div>
  );
};
