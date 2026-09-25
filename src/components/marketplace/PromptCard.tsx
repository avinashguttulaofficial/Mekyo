import React from 'react';
import { Heart, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { Prompt } from '../../types';
import { CategoryBadge } from './CategoryBadge';
import { RatingStars } from '../common/RatingStars';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VideoPreview } from './VideoPreview';

interface PromptCardProps {
  prompt: Prompt;
  onOpenPrompt?: (prompt: Prompt) => void;
  showPlayPreview?: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  onOpenPrompt,
  showPlayPreview = false,
}) => {
  const { categories, isFavorited, toggleFavorite, hasPurchased } = useMarketplace();
  const category = categories.find((c) => c.id === prompt.category_id);
  const favorited = isFavorited(prompt.id);
  const isOwned = hasPurchased(prompt.id);

  const formatPrice = () => {
    if (isOwned) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3" /> OWNED
        </span>
      );
    }
    if (prompt.access_type === 'free' || prompt.price === 0) {
      return <span className="font-semibold text-xs tracking-wide text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">FREE</span>;
    }
    if (prompt.access_type === 'pro') {
      return <span className="font-semibold text-xs tracking-wide text-white bg-[#111111] px-2 py-0.5 rounded">PRO</span>;
    }
    return <span className="font-semibold tabular-nums text-sm text-[#111111]">${prompt.price.toFixed(2)}</span>;
  };

  return (
    <div
      onClick={() => onOpenPrompt && onOpenPrompt(prompt)}
      className="group relative flex flex-col bg-white border border-[#E7E7E3] hover:border-neutral-400 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm"
    >
      {/* Top Media Area: Video Preview / Image */}
      <div className="relative aspect-[16/10] w-full bg-[#111111] overflow-hidden">
        {showPlayPreview ? (
          <VideoPreview prompt={prompt} autoplayOnHover={true} aspectRatio="16:9" />
        ) : (
          <img
            src={prompt.cover_image_url}
            alt={prompt.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Video demonstration badge & Play indicator */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
          <Play className="w-2.5 h-2.5 fill-current" />
          <span>Demo</span>
        </div>

        {/* Heart / Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(prompt.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-150 ${
            favorited
              ? 'bg-white text-rose-500 shadow-sm'
              : 'bg-black/30 text-white hover:bg-white hover:text-[#111111]'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Meta Header */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#666666] mb-2">
          {category && <CategoryBadge name={category.name} color={category.accent_color} />}
          <span className="text-[#8A8A8A] font-mono text-[11px]">{prompt.ai_tool}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm sm:text-base text-[#111111] line-clamp-1 group-hover:text-black transition-colors">
          {prompt.title}
        </h3>

        {/* Short description */}
        <p className="mt-1.5 text-xs text-[#666666] line-clamp-2 leading-relaxed flex-1">
          {prompt.short_description}
        </p>

        {/* Card Footer: Rating, Price, Action */}
        <div className="mt-4 pt-3.5 border-t border-[#E7E7E3] flex items-center justify-between">
          <RatingStars rating={prompt.rating} count={prompt.rating_count} />

          <div className="flex items-center gap-2.5">
            {formatPrice()}
            <span className="text-xs font-medium text-[#111111] group-hover:translate-x-0.5 transition-transform flex items-center">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
