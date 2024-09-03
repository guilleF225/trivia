import { createClient } from "@supabase/supabase-js";

const apiKey = import.meta.env.SUPABASE_ANON_KEY;
const url = import.meta.env.SUPABASE_URL;

const supabase = createClient(url, apiKey);

export default supabase;
