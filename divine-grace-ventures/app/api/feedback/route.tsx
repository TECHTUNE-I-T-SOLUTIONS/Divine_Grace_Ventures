// app/api/feedback/route.ts
import { NextResponse } from 'next/server';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  const supabase = createPagesServerClient({ cookies });
  const { user_id, message } = await req.json();

  // Check if user_id is provided
  if (!user_id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  // Insert the feedback into the 'feedback' table with the user_id
  const { data, error } = await supabase
    .from('feedback')
    .insert([{ user_id, message }]);

  // If there was an error inserting the feedback
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Return a success response
  return NextResponse.json({ success: true, data });
}

export async function GET(req) {
  const supabase = createPagesServerClient({ cookies });

  // Fetch all feedback messages from the 'feedback' table
  const { data, error } = await supabase
    .from('feedback')
    .select('user_id, message, created_at') // Select user_id and message along with timestamp
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
