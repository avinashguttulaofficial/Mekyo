import React, { createContext, useContext, useEffect, useState } from 'react';
import { Category, Favorite, Prompt, Purchase, Review, SiteSettings, Subscription } from '../types';
import { AccessCheckResult, canAccessPrompt } from '../utils/accessControl';
import { useAuth } from './AuthContext';
import * as api from '../lib/api';

export interface ToastMessage {
  id: string;
  title: string;
  type?: 'success' | 'info' | 'error';
}

interface MarketplaceContextType {
  prompts: Prompt[];
  categories: Category[];
  favorites: Favorite[];
  purchases: Purchase[];
  subscriptions: Subscription[];
  siteSettings: SiteSettings;
  toasts: ToastMessage[];
  toast: ToastMessage | null;
  isLoading: boolean;
  hideToast: () => void;
  showToast: (title: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  toggleFavorite: (promptId: string) => Promise<void>;
  isFavorited: (promptId: string) => boolean;
  hasPurchased: (promptId: string) => boolean;
  checkAccess: (prompt: Prompt) => AccessCheckResult;
  addReview: (promptId: string, rating: number, reviewText: string) => Promise<boolean>;
  getReviewsForPrompt: (promptId: string) => Review[];
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({} as SiteSettings);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPublicData = async () => {
    const [fetchedPrompts, fetchedCategories, fetchedSettings, fetchedReviews] = await Promise.all([
      api.fetchPrompts(),
      api.fetchCategories(),
      api.fetchSiteSettings(),
      api.fetchReviews(), // fetch all approved reviews
    ]);
    
    setPrompts(fetchedPrompts);
    setCategories(fetchedCategories);
    if (fetchedSettings) setSiteSettings(fetchedSettings);
    setReviews(fetchedReviews);
  };

  const loadUserData = async () => {
    if (!user) {
      setFavorites([]);
      setPurchases([]);
      setSubscriptions([]);
      return;
    }

    const [fetchedFavs, fetchedPurchases, fetchedSubs] = await Promise.all([
      api.fetchFavorites(user.id),
      api.fetchPurchases(user.id),
      api.fetchSubscriptions(user.id),
    ]);

    setFavorites(fetchedFavs);
    setPurchases(fetchedPurchases);
    setSubscriptions(fetchedSubs);
  };

  const refreshData = async () => {
    setIsLoading(true);
    await loadPublicData();
    await loadUserData();
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const showToast = (title: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const hideToast = () => {
    setToasts([]);
  };

  const toast = toasts.length > 0 ? toasts[toasts.length - 1] : null;

  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<void> => {
    await api.saveSiteSettings(newSettings);
    const updated = await api.fetchSiteSettings();
    if (updated) setSiteSettings(updated);
  };

  const toggleFavorite = async (promptId: string) => {
    if (!user) {
      showToast('Please sign in to save prompts to your favorites', 'info');
      return;
    }

    const isFav = favorites.some((f) => f.prompt_id === promptId);
    if (isFav) {
      await api.removeFavorite(user.id, promptId);
      showToast('Removed from favorites', 'info');
    } else {
      await api.addFavorite(user.id, promptId);
      showToast('Added to favorites', 'success');
    }
    const updatedFavs = await api.fetchFavorites(user.id);
    setFavorites(updatedFavs);
  };

  const isFavorited = (promptId: string): boolean => {
    return favorites.some((f) => f.prompt_id === promptId);
  };

  const hasPurchased = (promptId: string): boolean => {
    return purchases.some((p) => p.prompt_id === promptId && p.status === 'paid');
  };

  const checkAccess = (prompt: Prompt): AccessCheckResult => {
    return canAccessPrompt(user, prompt, purchases, subscriptions);
  };

  const addReview = async (promptId: string, rating: number, reviewText: string): Promise<boolean> => {
    if (!user) {
      showToast('You must be signed in to submit a review', 'error');
      return false;
    }

    const prompt = prompts.find((p) => p.id === promptId);
    if (!prompt) return false;

    const access = checkAccess(prompt);
    if (!access.canAccess && prompt.price > 0) {
      showToast('Only verified purchasers can review this prompt', 'error');
      return false;
    }

    const newReview = {
      user_id: user.id,
      prompt_id: promptId,
      user_name: user.full_name || 'Anonymous User',
      user_avatar: user.avatar_url,
      rating,
      review: reviewText,
      status: 'approved' as const,
    };

    const savedReview = await api.submitReview(newReview);
    if (savedReview) {
      setReviews(prev => [savedReview, ...prev]);
      // Re-fetch prompts so rating/rating_count updated by DB trigger is reflected
      const updatedPrompts = await api.fetchPrompts();
      setPrompts(updatedPrompts);
      showToast('Review submitted successfully!', 'success');
      return true;
    }
    return false;
  };

  const getReviewsForPrompt = (promptId: string): Review[] => {
    return reviews.filter(r => r.prompt_id === promptId);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        prompts,
        categories,
        favorites,
        purchases,
        subscriptions,
        siteSettings,
        toasts,
        toast,
        isLoading,
        hideToast,
        showToast,
        removeToast,
        refreshData,
        updateSettings,
        toggleFavorite,
        isFavorited,
        hasPurchased,
        checkAccess,
        addReview,
        getReviewsForPrompt,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within MarketplaceProvider');
  }
  return context;
};
