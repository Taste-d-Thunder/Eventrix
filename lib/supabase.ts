/**
 * lib/supabase.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Supabase client initialisation.
 *
 * The client is only created when BOTH env vars are set.
 * Every data-access function in lib/db.ts checks `isSupabaseConfigured()`
 * before calling Supabase — if false it falls back to localStorage.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Singleton Supabase client — null when env vars are missing */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/** Quick boolean check used by the data layer */
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}
