import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com service role — APENAS em Server Actions / Route Handlers.
 * Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` ao browser.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Defina SUPABASE_SERVICE_ROLE_KEY e NEXT_PUBLIC_SUPABASE_URL no servidor.");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
