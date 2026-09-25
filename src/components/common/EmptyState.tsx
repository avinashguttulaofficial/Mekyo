import React from 'react';
import { Sparkles, FolderOpen, Heart, Search, ShoppingBag, MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: 'folder' | 'heart' | 'search' | 'cart' | 'review' | 'sparkles';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon = 'sparkles',
}) => {
  const IconComponent = {
    folder: FolderOpen,
    heart: Heart,
    search: Search,
    cart: ShoppingBag,
    review: MessageSquare,
    sparkles: Sparkles,
  }[icon];

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white border border-[#E7E7E3] rounded-2xl max-w-md mx-auto my-6 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 mb-4">
        <IconComponent className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-base text-[#111111] mb-1.5">{title}</h3>
      <p className="text-xs text-[#666666] leading-relaxed mb-6 max-w-xs">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
