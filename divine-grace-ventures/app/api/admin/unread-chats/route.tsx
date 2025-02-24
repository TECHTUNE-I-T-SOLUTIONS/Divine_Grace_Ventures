import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = createServerSupabaseClient({ req });

  try {
    // Query the `chats` table to get unread chats for the admin
    const { data, error } = await supabase
      .from('chats')
      .select('id')
      .eq('is_read', false); // Assuming `is_read` is a boolean column

    if (error) {
      throw error;
    }

    // Return the count of unread chats
    return NextResponse.json({ unreadCount: data?.length || 0 });
  } catch (error) {
    console.error('Error fetching unread chats:', error);
    return NextResponse.json({ error: 'Error fetching unread chats' }, { status: 500 });
  }
}
