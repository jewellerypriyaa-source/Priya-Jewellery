/**
 * Supabase Client — Storage only
 *
 * Two clients:
 *  - supabaseAnon  → public read (use in client components if ever needed)
 *  - supabaseAdmin → service-role (server-side only, for uploads/deletes)
 *
 * NEVER import supabaseAdmin in any client component — it carries the
 * service_role key which must stay server-side.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

/** Public client — safe for browser */
export const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** Admin client — SERVER SIDE ONLY */
export const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/** Storage bucket name */
export const STORAGE_BUCKET = "product-images";
