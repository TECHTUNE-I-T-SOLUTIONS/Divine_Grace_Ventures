// app/api/admin/profile/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const adminId = session.user.id;
  // Fetch admin details from the "admins" table
  const { data, error: fetchError } = await supabase
    .from('admins')
    .select('*')
    .eq('id', adminId)
    .single();
  if (fetchError || !data) {
    return NextResponse.json({ error: fetchError?.message || 'Admin not found' }, { status: 404 });
  }
  return NextResponse.json({ admin: data });
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const adminId = session.user.id;
  const { full_name, phone, password } = await request.json();
  const payload: any = { full_name, phone };
  if (password) {
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }
  const { data, error } = await supabase
    .from('admins')
    .update(payload)
    .eq('id', adminId)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Admin profile updated successfully', data });
}
