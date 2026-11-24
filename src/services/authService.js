import { ensureSupabaseConfigured, supabase } from '../components/supabase';

export async function signInWithEmail(email, password) {
  const client = ensureSupabaseConfigured();

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpWithEmail(email, password) {
  const client = ensureSupabaseConfigured();

  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCurrentUser() {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data?.user ?? null;
}

export async function signOut() {
  const client = ensureSupabaseConfigured();

  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}
