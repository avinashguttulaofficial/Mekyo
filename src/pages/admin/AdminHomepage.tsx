import React from 'react';
import { Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import * as api from '../../lib/api';
import { Prompt } from '../../types';

export const AdminHomepage: React.FC = () => {
  const { prompts, refreshData, showToast } = useMarketplace();

  const handleToggleFeatured = (prompt: Prompt) => {
    const updated = { ...prompt, featured: !prompt.featured };
    api.savePrompt(updated);
    refreshData();
    showToast(
      updated.featured ? `Added "${prompt.title}" to Featured` : `Removed from Featured`,
      'info'
    );
  };

  const handleToggleTrending = (prompt: Prompt) => {
    const updated = { ...prompt, trending: !prompt.trending };
    api.savePrompt(updated);
    refreshData();
    showToast(
      updated.trending ? `Added "${prompt.title}" to Trending` : `Removed from Trending`,
      'info'
    );
  };

  const featuredList = prompts.filter((p) => p.featured);
  const trendingList = prompts.filter((p) => p.trending);

  return (
    <div className="space-y-8 pb-16">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Editorial Curation
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          Homepage Feature Controls
        </h1>
        <p className="text-xs text-[#666666]">
          Directly toggle which high-performing prompts are featured in the Hero, Featured grid, and Trending sections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-[#E7E7E3] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8A8A8A]">Featured Prompts</span>
            <span className="text-xl font-bold block text-[#111111]">{featuredList.length} items</span>
          </div>
          <Star className="w-6 h-6 text-amber-500 fill-amber-500/20" />
        </div>

        <div className="p-4 bg-white border border-[#E7E7E3] rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8A8A8A]">Trending Prompts</span>
            <span className="text-xl font-bold block text-[#111111]">{trendingList.length} items</span>
          </div>
          <TrendingUp className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* Prompts Assignment List */}
      <div className="bg-white border border-[#E7E7E3] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Prompt Item</th>
              <th className="py-3 px-3 font-semibold">Engine</th>
              <th className="py-3 px-3 font-semibold">Price</th>
              <th className="py-3 px-3 font-semibold text-center">Featured on Homepage</th>
              <th className="py-3 px-4 font-semibold text-center">Trending Shelf</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E7E3]">
            {prompts.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      className="w-8 h-8 rounded-lg object-cover bg-neutral-100 shrink-0 border border-[#E7E7E3]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-semibold text-neutral-900 truncate max-w-sm">
                      {p.title}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono text-[#8A8A8A]">{p.ai_tool}</td>
                <td className="py-3 px-3 font-bold tabular-nums text-neutral-900">
                  {p.price === 0 ? 'Free' : `$${p.price.toFixed(2)}`}
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                      p.featured
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    {p.featured ? '★ Featured' : '+ Feature'}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleToggleTrending(p)}
                    className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                      p.trending
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    {p.trending ? '🔥 Trending' : '+ Mark Trending'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
