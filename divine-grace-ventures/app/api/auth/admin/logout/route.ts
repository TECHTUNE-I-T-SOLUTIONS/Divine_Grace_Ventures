import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { adminId } = await request.json();

    if (!adminId) {
      return NextResponse.json({ error: 'Missing admin ID' }, { status: 400 });
    }

    // Update admin's is_active to false
    const { error } = await supabase
      .from('admins')
      .update({ is_active: false })
      .eq('id', adminId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create the response object
    const response = NextResponse.json({ message: 'Logout successful' });

    // Delete cookies (Note: No path option allowed in Next.js App Router cookies.delete())
    response.cookies.delete('auth-token');
    response.cookies.delete('admin_id');
    response.cookies.delete('admin_email');

    return response;
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
