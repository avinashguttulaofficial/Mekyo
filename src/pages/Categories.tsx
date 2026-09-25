import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CategoryBadge } from '../components/marketplace/CategoryBadge';

interface CategoriesProps {
  onSelectCategory: (categorySlug: string) => void;
}

export const Categories: React.FC<CategoriesProps> = ({ onSelectCategory }) => {
  const { categories, prompts } = useMarketplace();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Page Heading */}
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
          Taxonomy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
          Categories
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#666666] leading-relaxed">
          Browse specialized prompt collections organized by production discipline, AI engine compatibility, and commercial output requirements.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const categoryPrompts = prompts.filter((p) => p.category_id === cat.id);
          const count = categoryPrompts.length;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group p-6 bg-white border border-[#E7E7E3] hover:border-neutral-400 rounded-2xl transition-all shadow-xs hover:shadow-sm cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <CategoryBadge name={cat.name} color={cat.accent_color} size="md" />
                  <span className="text-xs font-mono text-[#8A8A8A] tabular-nums">
                    {count} {count === 1 ? 'prompt' : 'prompts'}
                  </span>
                </div>
                <p className="text-xs text-[#666666] leading-relaxed mb-4">
                  {cat.description}
                </p>
              </div>

              {/* Sample prompt names preview */}
              <div className="pt-4 border-t border-[#E7E7E3] flex items-center justify-between">
                <span className="text-[11px] text-[#8A8A8A]">View all collection items</span>
                <span className="text-xs font-semibold text-[#111111] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
