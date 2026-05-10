import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kcugywbwoqzgivksuisj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWd5d2J3b3F6Z2l2a3N1aXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTUwNTUsImV4cCI6MjA5Mzk3MTA1NX0.GDocJTRnxcAe3j4vtH5r8iWuRfOBwxR9LSXCVIlT0yk';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not found in environment variables, using fallback values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
