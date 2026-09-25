import React from 'react';
import { ArrowRight, Sparkles, Check, Play, Shield, Zap, Eye, Copy, Layers } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PromptCard } from '../components/marketplace/PromptCard';
import { VideoPreview } from '../components/marketplace/VideoPreview';
import { CategoryBadge } from '../components/marketplace/CategoryBadge';
import { Prompt } from '../types';

interface HomeProps {
  onNavigate: (path: string) => void;
  onOpenPrompt: (prompt: Prompt) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, onOpenPrompt }) => {
  const { prompts, categories, siteSettings } = useMarketplace();

  // Hero showcase: most-sold prompt
  const heroPrompt = [...prompts].sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0))[0];

  // Featured prompts list
  const featuredPrompts = prompts.filter((p) => p.featured).slice(0, 4);

  // Trending prompts list
  const trendingPrompts = prompts.filter((p) => p.trending).slice(0, 4);

  if (!heroPrompt) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-neutral-200 border-t-[#111111] rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="pt-10 md:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#111111] bg-white border border-[#E7E7E3] px-3 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#B8FF3D]" />
              <span>Commercial Grade AI Prompts</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.08] text-balance">
              Discover the prompt behind the result.
            </h1>

            <p className="text-base sm:text-lg text-[#666666] leading-relaxed max-w-xl">
              Explore premium AI prompts with real examples, video demonstrations, and ready-to-use instructions calibrated for production workflows.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('/explore')}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Explore Prompts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/explore?price=free')}
                className="px-6 py-3.5 text-sm font-semibold text-[#111111] bg-white hover:bg-neutral-100 border border-[#E7E7E3] rounded-xl transition-colors cursor-pointer"
              >
                Browse Free Prompts
              </button>
            </div>

            {/* Quiet Editorial Proof adjacency */}
            <div className="pt-4 border-t border-[#E7E7E3] flex items-center gap-6 text-xs text-[#8A8A8A]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>Verified Generation Demos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#111111]" />
                <span>Flux, Midjourney & Sora</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase Card */}
          <div className="lg:col-span-6">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E7E7E3] shadow-lg">
              {/* Interactive Demonstration Visual */}
              <div className="relative rounded-xl overflow-hidden mb-4">
                <VideoPreview
                  prompt={heroPrompt}
                  isDetail={false}
                  aspectRatio="16:9"
                  autoplayOnHover={false}
                />
              </div>

              {/* Showcase metadata card below demo */}
              <div className="flex items-start justify-between gap-4 pt-1">
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 text-xs text-[#666666] mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B8FF3D] bg-[#111111] px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                      #1 Best Seller
                    </span>
                    <span className="font-semibold text-[#111111]">{heroPrompt.ai_tool}</span>
                    <span>·</span>
                    <span className="text-[#8A8A8A]">{heroPrompt.model}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#111111] truncate">{heroPrompt.title}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-[#8A8A8A] block">License</span>
                  <span className="text-lg font-bold tabular-nums text-[#111111]">
                    {heroPrompt.price === 0 ? 'Free' : `$${heroPrompt.price.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E7E7E3] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#8A8A8A]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {(heroPrompt.views || 0).toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    {(heroPrompt.sales_count || 0).toLocaleString()} sold
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPrompt(heroPrompt)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#111111] hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>View Prompt</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROMPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Featured Prompts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/explore')}
            className="text-xs font-semibold text-[#111111] hover:text-neutral-600 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View all in directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onOpenPrompt={onOpenPrompt} />
          ))}
        </div>
      </section>

      {/* 3. TRENDING PROMPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
              Most Accessed This Week
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Trending prompts
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/explore?sort=popular')}
            className="text-xs font-semibold text-[#111111] hover:text-neutral-600 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onOpenPrompt={onOpenPrompt} />
          ))}
        </div>
      </section>

      {/* 4. CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Browse by Discipline
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
            Explore by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = prompts.filter((p) => p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onNavigate(`/explore?category=${cat.slug}`)}
                className="group p-5 bg-white border border-[#E7E7E3] hover:border-neutral-400 rounded-xl text-left transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between min-h-[120px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CategoryBadge name={cat.name} color={cat.accent_color} />
                    <span className="text-[11px] font-mono text-[#8A8A8A] tabular-nums">
                      {count} {count === 1 ? 'prompt' : 'prompts'}
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center text-xs font-medium text-[#111111] group-hover:translate-x-1 transition-transform">
                  <span>Browse category</span>
                  <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] text-white rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B8FF3D] block mb-1">
              Workflow Protocol
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              How Mekyo Works
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-neutral-400">
              A frictionless four-step cycle from discovery to production-ready output.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 border-l border-neutral-800 pl-5">
              <span className="font-mono text-xs text-[#B8FF3D] font-bold">01</span>
              <h3 className="text-lg font-bold text-white">Discover</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Filter through verified prompts across photography, commercial video, marketing, and systems architecture.
              </p>
            </div>

            <div className="space-y-3 border-l border-neutral-800 pl-5">
              <span className="font-mono text-xs text-[#8BD3FF] font-bold">02</span>
              <h3 className="text-lg font-bold text-white">Watch</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Observe the visual demonstration showing the exact input prompt, synthesis steps, and the final high-resolution render.
              </p>
            </div>

            <div className="space-y-3 border-l border-neutral-800 pl-5">
              <span className="font-mono text-xs text-[#FFD166] font-bold">03</span>
              <h3 className="text-lg font-bold text-white">Buy or Unlock</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Securely purchase individual commercial licenses via Razorpay or unlock free prompts instantly upon login.
              </p>
            </div>

            <div className="space-y-3 border-l border-neutral-800 pl-5">
              <span className="font-mono text-xs text-[#9BE7C4] font-bold">04</span>
              <h3 className="text-lg font-bold text-white">Create</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Copy the full master prompt, negative exclusions, and calibrated camera parameters directly into your AI workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROMOTIONAL CTA (Anti-creator: "Build better with better prompts") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E7E7E3] rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-xs space-y-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
            Editorial Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
            Build better with better prompts.
          </h2>
          <p className="text-sm sm:text-base text-[#666666] max-w-xl mx-auto leading-relaxed">
            Every prompt in the Mekyo library is crafted, tested, and documented by our editorial engineering team. No broken syntax, no unpredictable outputs, and no generic placeholders.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/explore')}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Explore the Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
