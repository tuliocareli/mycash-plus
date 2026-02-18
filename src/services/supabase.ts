
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';



if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing. Check your .env file or Vercel environment variables.');
}

// Fallback to prevent app crash on startup if env vars are missing
// This allows the UI to render and show actionable errors instead of a white screen
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseKey || 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey);
