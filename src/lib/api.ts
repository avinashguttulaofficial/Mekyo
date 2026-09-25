import { supabase } from './supabase';
export { supabase };
import { Category, Prompt, Review, Favorite, Purchase, Subscription, SiteSettings, ContactMessage, UserProfile } from '../types';

// Users
export async function fetchUsers(): Promise<UserProfile[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('profiles').select('*');
  return data as UserProfile[] || [];
}
export async function saveUser(user: UserProfile): Promise<void> {
  if (!supabase) return;
  await supabase.from('profiles').upsert(user);
}

// Prompts
export async function fetchPrompts(): Promise<Prompt[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('prompts').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
  return data as Prompt[];
}
export async function savePrompt(prompt: Prompt): Promise<void> {
  if (!supabase) return;
  await supabase.from('prompts').upsert(prompt);
}
export async function deletePrompt(id: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('prompts').delete().eq('id', id);
}

export async function incrementPromptViews(id: string): Promise<void> {
  if (!supabase) return;
  // RPC runs as SECURITY DEFINER, bypasses RLS — this is the only safe way to update views
  await supabase.rpc('increment_prompt_views', { p_prompt_id: id });
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as Category[];
}
export async function saveCategory(category: Category): Promise<void> {
  if (!supabase) return;
  await supabase.from('categories').upsert(category);
}
export async function deleteCategory(id: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('categories').delete().eq('id', id);
}

// User Profiles
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data as UserProfile;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) console.error('Error updating profile:', error);
}

// Favorites
export async function fetchFavorites(userId: string): Promise<Favorite[]> {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase.from('favorites').select('*').eq('user_id', userId);
  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
  return data as Favorite[];
}

export async function addFavorite(userId: string, promptId: string): Promise<Favorite | null> {
  if (!supabase) return null;
  const newFav = { user_id: userId, prompt_id: promptId };
  const { data, error } = await supabase.from('favorites').insert(newFav).select().single();
  if (error) {
    console.error('Error adding favorite:', error);
    return null;
  }
  return data as Favorite;
}

export async function removeFavorite(userId: string, promptId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('favorites').delete().match({ user_id: userId, prompt_id: promptId });
  if (error) console.error('Error removing favorite:', error);
}

// Purchases
export async function fetchPurchases(userId?: string): Promise<Purchase[]> {
  if (!supabase) return [];
  let query = supabase.from('purchases').select('*');
  if (userId) query = query.eq('user_id', userId);
  const { data } = await query;
  return data as Purchase[] || [];
}

// Subscriptions
export async function fetchSubscriptions(userId?: string): Promise<Subscription[]> {
  if (!supabase) return [];
  let query = supabase.from('subscriptions').select('*');
  if (userId) query = query.eq('user_id', userId);
  const { data } = await query;
  return data as Subscription[] || [];
}
export async function saveSubscription(sub: Subscription): Promise<void> {
  if (!supabase) return;
  await supabase.from('subscriptions').upsert(sub);
}

// Reviews
export async function fetchReviews(promptId?: string): Promise<Review[]> {
  if (!supabase) return [];
  let query = supabase.from('reviews').select('*');
  if (promptId) {
    query = query.eq('prompt_id', promptId).eq('status', 'approved');
  }
  const { data, error } = await query;
  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data as Review[];
}

export async function submitReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('reviews').insert(review).select().single();
  if (error) {
    console.error('Error submitting review:', error);
    return null;
  }
  return data as Review;
}
export async function deleteReview(id: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('reviews').delete().eq('id', id);
}
export async function moderateReview(id: string, isHidden: boolean): Promise<void> {
  if (!supabase) return;
  await supabase.from('reviews').update({ status: isHidden ? 'hidden' : 'approved', is_hidden: isHidden }).eq('id', id);
}

// Site Settings
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
  return data as SiteSettings;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('site_settings').update(settings).eq('id', 1); // Assuming single row id=1
  if (error) console.error('Error updating site settings:', error);
}

// Contact Messages
export async function fetchMessages(): Promise<ContactMessage[]> {
  if (!supabase) return [];
  const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
  return data as ContactMessage[] || [];
}
export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('contact_messages').insert({ ...msg, status: 'new' });
  if (error) console.error('Error submitting message:', error);
}
export async function updateMessageStatus(id: string, status: string): Promise<void> {
  if (!supabase) return;
  await supabase.from('contact_messages').update({ status }).eq('id', id);
}

// Media Upload
export async function uploadMedia(
  file: File,
  folder: 'covers' | 'videos' | 'examples' = 'covers',
  promptId?: string,
  onProgress?: (progress: number) => void
): Promise<string | null> {
  if (onProgress) onProgress(10);

  if (!supabase) {
    console.warn('Supabase client is not configured. Falling back to Object URL for local preview.');
    if (onProgress) {
      onProgress(50);
      await new Promise((resolve) => setTimeout(resolve, 200));
      onProgress(100);
    }
    return URL.createObjectURL(file);
  }

  // Create safe unique filename
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const safeFilename = `${timestamp}_${randomStr}_${cleanName}`;
  const filePath = promptId
    ? `${folder}/${promptId}/${safeFilename}`
    : `${folder}/${safeFilename}`;

  let progressInterval: any = null;
  if (onProgress) {
    let currentProgress = 15;
    progressInterval = setInterval(() => {
      currentProgress = Math.min(currentProgress + 15, 90);
      onProgress(currentProgress);
    }, 120);
  }

  try {
    const { data, error } = await supabase.storage
      .from('prompt-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (progressInterval) clearInterval(progressInterval);

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw error;
    }

    if (onProgress) onProgress(100);

    const { data: publicUrlData } = supabase.storage
      .from('prompt-media')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    if (progressInterval) clearInterval(progressInterval);
    console.error('Upload media failed:', err);
    throw err;
  }
}

