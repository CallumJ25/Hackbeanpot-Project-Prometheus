import { createClient } from '@supabase/supabase-js';

// Vite exposes env vars via import.meta.env with VITE_ prefix (not REACT_APP_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);