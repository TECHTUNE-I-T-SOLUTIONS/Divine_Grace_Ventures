import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface ProfileUpdatePayload {
  full_name?: string;
  phone?: string;
  address?: string;
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
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

  const payload: ProfileUpdatePayload = {}; // Use the defined interface

  if (full_name) payload.full_name = full_name;
  if (phone) payload.phone = phone;
  if (address) payload.address = address;

  if (password) {
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  const { data, error } = await supabase.from('users').update(payload).eq('id', userId).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Profile updated successfully', data });
}
