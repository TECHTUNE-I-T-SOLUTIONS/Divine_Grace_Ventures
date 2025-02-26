import { NextResponse } from 'next/server';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  const supabase = createPagesServerClient({ cookies });
  const { message, receiverId, senderRole } = await req.json(); // Expect senderRole: 'admin' or 'user'

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Define the payload based on the sender role
  const chatPayload = {
    message,
    sender_role: senderRole, // Either 'admin' or 'user'
  };

  if (senderRole === 'admin') {
    chatPayload.admin_id = parseInt(user.id); // Ensure it's an integer
  } else if (senderRole === 'user') {
    chatPayload.user_id = user.id; // Ensure it's a UUID
  } else {
    return NextResponse.json({ error: 'Invalid sender role' }, { status: 400 });
  }

  if (senderRole === 'admin') {
    chatPayload.user_id = receiverId; // Target user (UUID)
  } else {
    chatPayload.admin_id = parseInt(receiverId); // Target admin (Integer)
  }

  const { data, error } = await supabase.from('chats').insert([chatPayload]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function GET() { // Removed 'req' since it's not used
  const supabase = createPagesServerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('chats')
    .select('*')
    .or(`admin_id.eq.${user.id},user_id.eq.${user.id}`)
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
