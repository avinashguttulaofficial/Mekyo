export type UserRole = 'user' | 'admin';
export type UserPlan = 'free' | 'pro';
export type UserStatus = 'active' | 'suspended';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  plan: UserPlan;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export type User = UserProfile;

export type AccessType = 'free' | 'paid' | 'pro';
export type PromptStatus = 'draft' | 'published' | 'archived';

export interface RecommendedSettings {
  aspect_ratio?: string;
  stylize?: string;
  chaos?: string;
  sampling_steps?: number;
  cfg_scale?: number;
  seed?: string;
  model_version?: string;
  lighting?: string;
  camera?: string;
  [key: string]: any;
}

export interface Prompt {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string;
  tags?: string[];
  ai_tool: string; // 'Midjourney' | 'Flux' | 'ChatGPT' | 'Claude' | 'Sora' | 'Other'
  model: string;
  price: number;
  currency: string;
  access_type: AccessType;
  cover_image_url: string;
  demo_video_url?: string;
  example_images?: string[];
  full_prompt: string;
  negative_prompt?: string;
  instructions?: string;
  recommended_settings?: RecommendedSettings;
  seo_title?: string;
  seo_description?: string;
  status: PromptStatus;
  views: number;
  sales_count: number;
  rating: number;
  rating_count?: number;
  featured?: boolean;
  trending?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  accent_color: string;
  status: 'active' | 'archived';
  sort_order?: number;
  order?: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  prompt_id: string;
  created_at: string;
}

export type PurchaseStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface Purchase {
  id: string;
  user_id: string;
  prompt_id: string;
  amount: number;
  currency: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  status: PurchaseStatus;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  prompt_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  review: string;
  status: 'approved' | 'pending' | 'hidden';
  is_hidden?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  plan: 'pro';
  razorpay_subscription_id: string;
  razorpay_payment_id?: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  start_date: string;
  renewal_date: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  project_type?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  site_tagline?: string;
  tagline?: string;
  logo_text?: string;
  pro_monthly_price: number;
  currency: string;
  contact_email: string;
  featured_prompt_ids?: string[];
  trending_prompt_ids?: string[];
  razorpay_key_id?: string;
  twitter_url?: string;
  github_url?: string;
  discord_url?: string;
  updated_at: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}
