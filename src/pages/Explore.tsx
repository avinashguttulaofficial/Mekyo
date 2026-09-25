import React, { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PromptCard } from '../components/marketplace/PromptCard';
import { EmptyState } from '../components/common/EmptyState';
import { Prompt } from '../types';

interface ExploreProps {
  onOpenPrompt: (prompt: Prompt) => void;
  initialCategory?: string;
  initialPrice?: string;
  initialTool?: string;
}

export const Explore: React.FC<ExploreProps> = ({
  onOpenPrompt,
  initialCategory,
  initialPrice,
  initialTool,
}) => {
  const { prompts, categories } = useMarketplace();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedPrice, setSelectedPrice] = useState<string>(initialPrice || 'all');
  const [selectedTool, setSelectedTool] = useState<string>(initialTool || 'all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('newest');

  const aiTools = ['All', 'Flux', 'Midjourney', 'Sora', 'Claude', 'ChatGPT', 'Gemini'];

  // Filtered & Sorted Prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      // Must be published
      if (p.status !== 'published') return false;

      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cat = categories.find((c) => c.id === p.category_id);
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q);
        const matchTool = p.ai_tool.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
        const matchCat = cat?.name.toLowerCase().includes(q) || cat?.slug.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTool && !matchCat) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory);
        if (!cat || p.category_id !== cat.id) return false;
      }

      // Price filter
      if (selectedPrice === 'free' && p.price > 0 && p.access_type !== 'free') return false;
      if (selectedPrice === 'paid' && (p.price === 0 || p.access_type === 'free')) return false;

      // AI Tool filter
      if (selectedTool !== 'all' && selectedTool !== 'All') {
        if (!p.ai_tool.toLowerCase().includes(selectedTool.toLowerCase())) return false;
      }

      // Rating filter
      if (selectedRating > 0 && p.rating < selectedRating) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'purchased') return (b.sales_count || 0) - (a.sales_count || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });
  }, [prompts, categories, searchQuery, selectedCategory, selectedPrice, selectedTool, selectedRating, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPrice('all');
    setSelectedTool('all');
    setSelectedRating(0);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedPrice !== 'all' ||
    selectedTool !== 'all' ||
    selectedRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A8A8A]">
          Prompt Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
          Explore prompts
        </h1>
        <p className="text-xs sm:text-sm text-[#666666]">
          Search verified prompts across generative image, video, copywriting, and software design models.
        </p>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prompts, categories, AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#E7E7E3] rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#111111] transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#666666] pl-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 text-xs font-medium bg-white border border-[#E7E7E3] rounded-xl text-[#111111] focus:outline-none focus:border-[#111111] shadow-2xs cursor-pointer"
          >
            <option value="newest">Newest Added</option>
            <option value="popular">Most Popular</option>
            <option value="purchased">Most Purchased</option>
            <option value="rating">Highest Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Categories, Tool, Price, Rating */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E7E7E3]">
        {/* Category selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E7E7E3] rounded-lg text-[#111111] focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        {/* AI Tool selector */}
        <select
          value={selectedTool}
          onChange={(e) => setSelectedTool(e.target.value)}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E7E7E3] rounded-lg text-[#111111] focus:outline-none cursor-pointer"
        >
          <option value="all">All AI Tools</option>
          <option value="Flux">Flux</option>
          <option value="Midjourney">Midjourney</option>
          <option value="Sora">Sora</option>
          <option value="Claude">Claude</option>
          <option value="ChatGPT">ChatGPT</option>
        </select>

        {/* Price segmented filters */}
        <div className="flex items-center gap-1 bg-white border border-[#E7E7E3] p-0.5 rounded-lg text-xs font-medium">
          {(['all', 'free', 'paid'] as const).map((pr) => (
            <button
              key={pr}
              type="button"
              onClick={() => setSelectedPrice(pr)}
              className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                selectedPrice === pr ? 'bg-[#111111] text-white' : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              {pr}
            </button>
          ))}
        </div>

        {/* Rating filter */}
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(Number(e.target.value))}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-[#E7E7E3] rounded-lg text-[#111111] focus:outline-none cursor-pointer"
        >
          <option value={0}>Any Rating</option>
          <option value={4.5}>4.5+ Stars</option>
          <option value={4.8}>4.8+ Stars</option>
          <option value={4.9}>4.9+ Stars</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Prompts Count Indicator */}
      <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
        <span>
          Showing <strong className="text-[#111111] tabular-nums">{filteredPrompts.length}</strong> prompts
        </span>
      </div>

      {/* Results Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onOpenPrompt={onOpenPrompt} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No prompts found"
          description="We couldn't find any prompts matching your active filters. Try searching for other tools or clearing filters."
          actionText="Clear all filters"
          onAction={clearFilters}
          icon="search"
        />
      )}
    </div>
  );
};
