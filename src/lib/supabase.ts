import { createClient } from "@supabase/supabase-js";

// Supabase client reads environment variables so credentials never live in source control.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// A disabled client still lets the UI run with dummy content until real credentials are provided.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);

export const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET ?? "lumora-gallery";
