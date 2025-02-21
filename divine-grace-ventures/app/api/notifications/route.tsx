// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Assume your notifications table has columns:
    // id, message, user_id, email, type, created_at, updated_at
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ notifications: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { message, user_id, email, type } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Missing notification message' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ message, user_id, email, type }])
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Notification added successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
