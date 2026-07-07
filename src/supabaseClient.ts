import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://ukfdqrckpwmifiirljhe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZmRxcmNrcHdtaWZpaXJsamhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTkzNTYsImV4cCI6MjA5NzI3NTM1Nn0.sO-oHwcB93kBfCFYb7ryyvaxB0o3hzj1R4j2fd2HRQM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
