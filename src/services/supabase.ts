import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://hgynilgepkvqmklfxjzu.supabase.co';
export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneW5pbGdlcGt2cW1rbGZ4anp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1Mjg1MjYsImV4cCI6MjEwNDEwNDUyNn0.6q_N0wK1JbpGS5LBuN-TYwDGxLoKcTMevxb3AO7_VWk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
