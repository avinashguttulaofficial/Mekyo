import React, { useState, useEffect } from 'react';
import {
  Heart,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Share2,
  ShieldCheck,
  ChevronRight,
  Layers,
  FileCheck,
  MessageSquarePlus,
} from 'lucide-react';
import { Prompt } from '../types';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import * as api from '../lib/api';
import { VideoPreview } from '../components/marketplace/VideoPreview';
import { CategoryBadge } from '../components/marketplace/CategoryBadge';
import { RatingStars } from '../components/common/RatingStars';
import { PromptViewer } from '../components/marketplace/PromptViewer';
import { CheckoutModal } from '../components/marketplace/CheckoutModal';
import { ReviewCard } from '../components/marketplace/ReviewCard';
import { PromptCard } from '../components/marketplace/PromptCard';

interface PromptDetailProps {
  prompt: Prompt;
  onNavigate: (path: string) => void;
  onOpenPrompt: (prompt: Prompt) => void;
}

export const PromptDetail: React.FC<PromptDetailProps> = ({
  prompt,
  onNavigate,
  onOpenPrompt,
}) => {
  const { user, isAuthenticated } = useAuth();
  const {
    categories,
    prompts,
    isFavorited,
    toggleFavorite,
    checkAccess,
    showToast,
    getReviewsForPrompt,
    addReview,
  } = useMarketplace();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const category = categories.find((c) => c.id === prompt.category_id);
  const favorited = isFavorited(prompt.id);
  const access = checkAccess(prompt);
  const reviews = getReviewsForPrompt(prompt.id);

  // Increment view count once when prompt is opened
  const viewedRef = React.useRef(new Set<string>());
  useEffect(() => {
    if (!viewedRef.current.has(prompt.id)) {
      viewedRef.current.add(prompt.id);
      api.incrementPromptViews(prompt.id).catch(() => {/* silent fail */ });
    }
  }, [prompt.id]);

  // Related prompts in same category or engine
  const relatedPrompts = prompts
    .filter((p) => p.id !== prompt.id && (p.category_id === prompt.category_id || p.ai_tool === prompt.ai_tool))
    .slice(0, 3);

  const handlePrimaryAction = () => {
    if (!isAuthenticated) {
      showToast('Please sign in to unlock or purchase prompts', 'info');
      onNavigate('/login');
      return;
    }

    if (access.canAccess) {
      // Already unlocked!
      return;
    }

    if (prompt.access_type === 'pro' && user?.plan !== 'pro') {
      setCheckoutOpen(true);
      return;
    }

    setCheckoutOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.short_description,
          url: window.location.href,
        });
      } catch { }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Prompt link copied to clipboard', 'info');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmittingReview(true);
    const ok = await addReview(prompt.id, reviewRating, reviewText);
    if (ok) {
      setReviewText('');
    }
    setIsSubmittingReview(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-[#8A8A8A]">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-[#111111] transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <button
          onClick={() => onNavigate('/explore')}
          className="hover:text-[#111111] transition-colors cursor-pointer"
        >
          Explore
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        {category && (
          <>
            <button
              onClick={() => onNavigate(`/explore?category=${category.slug}`)}
              className="hover:text-[#111111] transition-colors cursor-pointer"
            >
              {category.name}
            </button>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
          </>
        )}
        <span className="text-[#111111] font-medium truncate max-w-xs">{prompt.title}</span>
      </nav>

      {/* Hero Grid: Media Demo on Left, Metadata & Purchase Module on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Col: Interactive Video Demo & Example Result Images */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E7E7E3] shadow-sm">
            <VideoPreview
              prompt={prompt}
              isDetail={true}
              aspectRatio="16:9"
              autoplayOnHover={false}
            />
          </div>

          {/* Example results strip */}
          {prompt.example_images && prompt.example_images.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-[#E7E7E3]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-3">
                Verified Output Demonstrations
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {prompt.example_images.map((img, idx) => {
                  const isVideo = img.toLowerCase().match(/\.(mp4|webm)$/i);
                  return (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden border border-[#E7E7E3] bg-neutral-100 group"
                    >
                      {isVideo ? (
                        <video
                          src={img}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={img}
                          alt={`Result preview ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="absolute bottom-1 right-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-xs font-mono">
                        #{idx + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Contiguous Purchase Module */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E7E3] shadow-xs space-y-6">
          {/* Category & AI Engine Header */}
          <div className="flex items-center justify-between gap-2">
            {category && <CategoryBadge name={category.name} color={category.accent_color} size="md" />}
            <span className="text-xs font-mono text-[#8A8A8A] bg-neutral-100 px-2.5 py-1 rounded">
              {prompt.ai_tool} · {prompt.model}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111] leading-tight">
              {prompt.title}
            </h1>
            <div className="mt-2.5 flex items-center justify-between">
              <RatingStars rating={prompt.rating} count={prompt.rating_count} size="md" />
              <span className="text-xs text-[#8A8A8A] tabular-nums font-mono">
                {prompt.sales_count || 0} unlocked
              </span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            {prompt.short_description}
          </p>

          {/* Price & Access Status Block */}
          <div className="p-4 bg-[#F7F7F5] rounded-xl border border-[#E7E7E3] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8A8A8A] block font-medium">Commercial License</span>
              <span className="text-2xl font-bold tabular-nums text-[#111111]">
                {prompt.access_type === 'free' || prompt.price === 0
                  ? 'Free Access'
                  : `$${prompt.price.toFixed(2)}`}
              </span>
            </div>

            <div>
              {access.canAccess ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Prompt Unlocked</span>
                </span>
              ) : prompt.access_type === 'pro' ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-[#111111] px-3 py-1 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-[#B8FF3D]" />
                  <span>Pro Exclusive</span>
                </span>
              ) : (
                <span className="text-xs text-[#8A8A8A]">One-time digital license</span>
              )}
            </div>
          </div>

          {/* Actions: Buy / Unlock / Copy */}
          <div className="space-y-2.5">
            {access.canAccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl text-center">
                <p className="text-xs font-semibold text-emerald-900 mb-1">
                  You have full commercial access to this prompt.
                </p>
                <p className="text-[11px] text-emerald-700">
                  Scroll down to view and copy the master prompt text, exclusions, and calibrated parameters.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="w-full py-3.5 px-5 text-sm font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                {!isAuthenticated ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Sign in to Unlock</span>
                  </>
                ) : prompt.access_type === 'free' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#B8FF3D]" />
                    <span>Unlock Free Prompt</span>
                  </>
                ) : prompt.access_type === 'pro' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-[#B8FF3D]" />
                    <span>Subscribe to Pro for Access</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Buy Prompt · ${prompt.price.toFixed(2)}</span>
                  </>
                )}
              </button>
            )}

            {/* Favorite and Share Utility Row */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => toggleFavorite(prompt.id)}
                className={`flex-1 py-2.5 px-3 text-xs font-medium rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer ${favorited
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-[#E7E7E3] bg-white text-[#666666] hover:border-neutral-400'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-current' : ''}`} />
                <span>{favorited ? 'Saved in Favorites' : 'Save to Favorites'}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 text-neutral-600 bg-white border border-[#E7E7E3] hover:border-neutral-400 rounded-xl transition-colors cursor-pointer"
                aria-label="Share prompt"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Included Features Checklist */}
          <div className="pt-4 border-t border-[#E7E7E3] space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#111111] block">
              What is included
            </span>
            <ul className="text-xs text-[#666666] space-y-2">
              <li className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                <span>Full verbatim production prompt text</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                <span>Negative prompt tokens & artifact exclusions</span>
              </li>
              <li className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-neutral-800 shrink-0" />
                <span>Calibrated camera, lighting, and aspect ratio variables</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Full commercial exploitation rights & lifetime access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content: Prompt Viewer (if unlocked) OR Locked Preview Box */}
      <section className="pt-4 border-t border-[#E7E7E3] space-y-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#111111] mb-2">
            Prompt Specification & Instructions
          </h2>
          <p className="text-xs text-[#666666] max-w-2xl leading-relaxed">
            {prompt.description}
          </p>
        </div>

        {access.canAccess ? (
          /* Unlocked Full Prompt Experience */
          <div className="space-y-6">
            <div className="p-3 bg-neutral-100 rounded-lg text-xs font-mono text-neutral-600 flex items-center justify-between">
              <span>Status: Authenticated & Authorized</span>
              <span className="text-[#111111] font-semibold">Ready for copy</span>
            </div>
            <PromptViewer prompt={prompt} />
          </div>
        ) : (
          /* Locked Prompt Preview Banner */
          <div className="relative bg-white border border-[#E7E7E3] rounded-2xl p-8 sm:p-12 text-center overflow-hidden shadow-xs">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white backdrop-blur-[3px] pointer-events-none" />

            <div className="relative z-10 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-[#111111] flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111111]">
                Full prompt available after {prompt.access_type === 'free' ? 'login' : 'purchase'}.
              </h3>
              <p className="text-xs text-[#666666] leading-relaxed">
                Unlock immediate access to the exact syntax, negative exclusions, and camera parameters used to generate the verified outputs above.
              </p>
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                {!isAuthenticated
                  ? 'Sign in to Unlock'
                  : prompt.access_type === 'free'
                    ? 'Unlock Free Prompt'
                    : `Buy Prompt · $${prompt.price.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="pt-8 border-t border-[#E7E7E3] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-[#666666]">
              Feedback from verified engineers, art directors, and designers who licensed this prompt.
            </p>
          </div>
        </div>

        {/* Review Form (if user is eligible) */}
        {isAuthenticated && access.canAccess && (
          <form onSubmit={handleSubmitReview} className="p-5 bg-white border border-[#E7E7E3] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Leave a Verified Review
              </span>
              <RatingStars
                rating={reviewRating}
                interactive={true}
                onRatingChange={setReviewRating}
                size="md"
              />
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share how this prompt performed in your generation workflow..."
              rows={3}
              required
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-[#E7E7E3] rounded-lg focus:outline-none focus:border-[#111111]"
            />
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-black rounded-lg transition-colors cursor-pointer"
            >
              {isSubmittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        )}

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-[#E7E7E3] rounded-xl text-xs text-[#8A8A8A]">
            No reviews submitted yet. Be the first verified creator to review this prompt!
          </div>
        )}
      </section>

      {/* Related Prompts */}
      {relatedPrompts.length > 0 && (
        <section className="pt-8 border-t border-[#E7E7E3] space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-[#111111]">
            Related Prompts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPrompts.map((p) => (
              <PromptCard key={p.id} prompt={p} onOpenPrompt={onOpenPrompt} />
            ))}
          </div>
        </section>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        prompt={prompt}
        isSubscription={prompt.access_type === 'pro' && user?.plan !== 'pro'}
        onSuccess={() => {
          showToast('Access granted! Full prompt revealed.', 'success');
        }}
      />
    </div>
  );
};
