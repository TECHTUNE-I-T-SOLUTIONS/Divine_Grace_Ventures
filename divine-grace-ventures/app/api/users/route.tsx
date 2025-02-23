import { NextResponse } from 'next/server';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req) {
  // Use the server-side Supabase client (with proper authentication/service role)
  const supabase = createPagesServerClient({ cookies });
  const { data, error } = await supabase
    .from('users')
    .select('id, username, email, is_online');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ users: data });
}
