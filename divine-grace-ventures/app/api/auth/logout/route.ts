import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
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

    // ✅ Correct way to delete cookie (Next.js 14+)
    response.cookies.delete('auth-token');

    return response;
  } catch (err) {
    console.error('Unexpected error during logout:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
