import { createClient } from '@supabase/supabase-js';

// Load credentials supporting both Next.js process.env and Vite import.meta.env
const supabaseUrl = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 
  import.meta.env.VITE_SUPABASE_URL || 
  "https://oqqtqbbigbzgbmgxegwv.supabase.co";

const supabaseAnonKey = 
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  "sb_publishable_P3bIaZ5Vx3mxBM1_YAoM5Q_w0FKxyOo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://oqqtqbbigbzgbmgxegwv.supabase.co" &&
  supabaseAnonKey !== "sb_publishable_P3bIaZ5Vx3mxBM1_YAoM5Q_w0FKxyOo"
);
export const storageBucket = "GALLERY";

