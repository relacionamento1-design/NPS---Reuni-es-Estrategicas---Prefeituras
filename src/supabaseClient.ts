import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ukfdqrckpwmifiirljhe.supabase.co";
const supabaseAnonKey = "sb_publishable_McpvehZA9pnliFPXgaGpZQ_5nWq_Q1p";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
