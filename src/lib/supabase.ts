import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// We use the anon key for client-side storage uploads
// Ensure you have RLS policies set on the bucket in Supabase!
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
