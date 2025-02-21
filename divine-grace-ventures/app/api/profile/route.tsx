// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Return the authenticated user's details (you may merge these with additional fields from your custom "users" table if needed)
  return NextResponse.json({ user: session.user });
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const { full_name, phone, address, password } = await request.json();
  const payload: any = { full_name, phone, address };

  // If a new password is provided, update the auth user.
  if (password) {
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }
  // Update additional profile details in your custom "users" table.
  const { data, error } = await supabase.from('users').update(payload).eq('id', userId).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Profile updated successfully', data });
}
