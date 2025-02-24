import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  // Assume the admin's id is sent in the body or can be retrieved from the JWT.
  const { adminId } = await request.json();
  if (!adminId) {
    return NextResponse.json({ error: 'Missing admin id' }, { status: 400 });
  }
  
  // Update admin's is_active to false
  const { error } = await supabase
    .from('admins')
    .update({ is_active: false })
    .eq('id', adminId);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.delete('auth-token', { path: '/' });
  return response;
}
