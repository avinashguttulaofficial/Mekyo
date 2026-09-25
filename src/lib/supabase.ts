import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client & Architecture Bridge
 * Allows integration with real Supabase database & storage when credentials are set,
 * while transparently managing state locally with zero broken states.
 */

export interface SupabaseConfig {
  url?: string;
  anonKey?: string;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http')),
  };
};

export const supabaseConfig = getSupabaseConfig();

export const supabase = supabaseConfig.isConfigured 
  ? createClient(supabaseConfig.url!, supabaseConfig.anonKey!) 
  : null;
