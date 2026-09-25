import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  size?: 'sm' | 'md';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  interactive = false,
  onRatingChange,
  size = 'sm',
}) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-[#111111]">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(star)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} p-0.5`}
              aria-label={`${star} star`}
            >
              <Star
                className={`${starSize} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : half
                    ? 'fill-amber-200 text-amber-400'
                    : 'text-neutral-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      <span className="font-semibold tabular-nums text-neutral-800">
        {rating > 0 ? rating.toFixed(1) : 'New'}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-[#8A8A8A] tabular-nums">({count})</span>
      )}
    </div>
  );
};
