
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kaxslanjocbwkavzzdek.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtheHNsYW5qb2Nid2thdnp6ZGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2MzgwNzEsImV4cCI6MjA4NDIxNDA3MX0.lBmy3Xt4jZ56ueBtmDE86Ydmh7c-rlXlaAL90ZsV1fI';

export const supabase = createClient(supabaseUrl, supabaseKey);
