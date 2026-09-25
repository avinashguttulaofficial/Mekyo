import React, { useState } from 'react';
import { Trash2, Eye, EyeOff, Star } from 'lucide-react';
import * as api from '../../lib/api';
import { Review } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { RatingStars } from '../../components/common/RatingStars';

export const AdminReviews: React.FC = () => {
  const { prompts, showToast } = useMarketplace();
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleToggleHide = (rev: Review) => {
    const updated = !rev.is_hidden;
    api.moderateReview(rev.id, updated);
    setReviews(reviews.map((r) => (r.id === rev.id ? { ...r, is_hidden: updated } : r)));
    showToast(updated ? 'Review hidden from store' : 'Review visible on store', 'info');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this review permanently?')) {
      api.deleteReview(id);
      setReviews(reviews.filter((r) => r.id !== id));
      showToast('Review deleted', 'info');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Quality & Social Proof
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          Customer Reviews ({reviews.length})
        </h1>
        <p className="text-xs text-[#666666]">
          Moderate user feedback, filter spam, or hide unconstructive reviews.
        </p>
      </div>

      <div className="bg-white border border-[#E7E7E3] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F7F5] border-b border-[#E7E7E3] text-[#8A8A8A] uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Reviewer</th>
              <th className="py-3 px-3 font-semibold">Prompt</th>
              <th className="py-3 px-3 font-semibold">Rating</th>
              <th className="py-3 px-3 font-semibold">Review Comment</th>
              <th className="py-3 px-3 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E7E3]">
            {reviews.map((rev) => {
              const prompt = prompts.find((p) => p.id === rev.prompt_id);
              return (
                <tr key={rev.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-neutral-900">{rev.user_name}</p>
                    <span className="text-[10px] text-[#8A8A8A] font-mono">ID: {rev.user_id}</span>
                  </td>
                  <td className="py-3 px-3 max-w-[180px] truncate text-neutral-800 font-medium">
                    {prompt?.title || rev.prompt_id}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <RatingStars rating={rev.rating} />
                  </td>
                  <td className="py-3 px-3 text-neutral-700 max-w-sm">
                    <p className="line-clamp-2">{rev.review}</p>
                    {rev.is_hidden && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        Currently Hidden
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 tabular-nums text-neutral-500 whitespace-nowrap">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleToggleHide(rev)}
                        title={rev.is_hidden ? 'Make visible' : 'Hide from store'}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 cursor-pointer"
                      >
                        {rev.is_hidden ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(rev.id)}
                        title="Delete review"
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
