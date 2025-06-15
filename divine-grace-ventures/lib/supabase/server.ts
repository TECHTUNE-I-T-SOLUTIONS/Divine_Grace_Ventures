// lib/supabase/server.ts
import { createClient as createSupabaseClientCore } from '@supabase/supabase-js';

export const createClient = () => {
  return createSupabaseClientCore(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
