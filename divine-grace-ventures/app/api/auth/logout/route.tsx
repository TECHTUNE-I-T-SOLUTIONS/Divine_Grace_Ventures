import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  // For simplicity, assume the client sends the admin's id in the request body.
  // Alternatively, you could extract the user id from the JWT.
  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
  }
  
  // Update the user's is_online status to false
  const { error } = await supabase
    .from('users')
    .update({ is_online: false })
    .eq('id', userId);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  const response = NextResponse.json({ message: 'Logout successful' });
  // Delete the authentication cookie
  response.cookies.delete('auth-token', { path: '/' });
  return response;
}
