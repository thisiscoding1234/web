import { createClient } from "@supabase/supabase-js";
const supabaseUrl = {}.VITE_SUPABASE_URL;
const supabaseAnonKey = {}.VITE_SUPABASE_ANON_KEY;
!!(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes("your-project") && !supabaseAnonKey.includes("your-anon-key"));
createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
