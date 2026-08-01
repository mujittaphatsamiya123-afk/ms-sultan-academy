import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// This client uses the SERVICE ROLE key and bypasses RLS entirely.
// It must NEVER be imported into any 'use client' component or exposed to the browser.
// Only import this inside Server Actions or Route Handlers that have already
// verified the caller is an authenticated admin.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
