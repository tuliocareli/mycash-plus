
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

console.log('--- Supabase Init Debug ---');
console.log('VITE_SUPABASE_URL exists:', !!supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY exists:', !!supabaseKey);
if (supabaseUrl) console.log('VITE_SUPABASE_URL value (partial):', supabaseUrl.substring(0, 15) + '...');
console.log('---------------------------');

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing. Check your .env file or Vercel environment variables.');
}

// Fallback to prevent app crash on startup if env vars are missing
// This allows the UI to render and show actionable errors instead of a white screen
// HARDCODED TEMPORARILY TO FIX VERCEL DEPLOYMENT - REVERT TO ENV VARS LATER
const safeUrl = supabaseUrl || 'https://kaxslanjocbwkavzzdek.supabase.co';
const safeKey = supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtheHNsYW5qb2Nid2thdnp6ZGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzgwNzEsImV4cCI6MjA4NDIxNDA3MX0.lBmy3Xt4jZ56ueBtmDE86Ydmh7c-rlXlaAL90ZsV1fI';

export const supabase = createClient(safeUrl, safeKey);
