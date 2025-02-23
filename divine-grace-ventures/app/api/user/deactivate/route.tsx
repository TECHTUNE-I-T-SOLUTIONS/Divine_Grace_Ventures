// app/api/user/deactivate/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  // Retrieve the authenticated user's ID from headers (adjust as needed for your auth)
  const userId = request.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  // Perform a soft delete: update the user's record
  const { data, error } = await supabase
    .from('users')
    .update({
      is_active: false,
      deleted_at: new Date().toISOString()
    })
    .eq('id', userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Account deactivated successfully', data });
}
