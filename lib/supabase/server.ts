import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Standard client — respects the signed-in user's session (used by admin
// pages/routes so Row Level Security applies correctly).
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // called from a Server Component — middleware refreshes the
            // session instead, safe to ignore here.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // see note above
          }
        },
      },
    }
  );
}

// Service-role client — bypasses RLS entirely. ONLY use this inside
// server-only route handlers for actions that must work for anonymous
// public visitors (submitting an application/inquiry, uploading a
// document) where there is intentionally no logged-in user. Never import
// this into client code and never expose SUPABASE_SERVICE_ROLE_KEY to the
// browser (it is not prefixed with NEXT_PUBLIC_ on purpose).
export function createServiceClient() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
