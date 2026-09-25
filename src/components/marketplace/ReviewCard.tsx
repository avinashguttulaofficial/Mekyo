import React from 'react';
import { Review } from '../../types';
import { RatingStars } from '../common/RatingStars';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-4 bg-white border border-[#E7E7E3] rounded-xl shadow-xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={
              review.user_avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user_name}`
            }
            alt={review.user_name}
            className="w-7 h-7 rounded-full bg-neutral-100 object-cover border border-[#E7E7E3]"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-xs font-semibold text-[#111111]">{review.user_name}</h4>
            <span className="text-[11px] text-[#8A8A8A]">{formattedDate}</span>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>

      <p className="text-xs text-[#444444] leading-relaxed">{review.review}</p>
    </div>
  );
};
