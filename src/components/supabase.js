import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function ensureSupabaseConfigured() {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error(
      'Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY antes de usar o Supabase.'
    );
  }

  return supabase;
}
