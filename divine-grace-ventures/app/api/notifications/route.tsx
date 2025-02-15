// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: Fetch notifications sorted by date (latest first)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ notifications: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Add a new notification
export async function POST(request: Request) {
  try {
    const { message, order_id, user_id } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Missing notification message' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ message, order_id, user_id }])
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Optionally: Call your helper function to send email/SMS notifications here.
    // For example: await sendNotification(email, phone, message);

    return NextResponse.json({ message: 'Notification added successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
