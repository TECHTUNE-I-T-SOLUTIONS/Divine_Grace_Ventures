import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(): Promise<NextResponse> {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data, error } = await supabase
      .from('chats')
      .select('id')
      .eq('is_read', false);

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ error: 'Failed to fetch unread chats' }, { status: 500 });
    }

    return NextResponse.json({ unreadCount: data?.length ?? 0 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Unexpected error fetching unread chats' }, { status: 500 });
  }
}
