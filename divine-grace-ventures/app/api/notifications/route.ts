// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server'; // Custom supabase client without cookies
import { sendEmail } from '@/lib/sendEmail';
// import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createClient();
  // const cookieStore = cookies();

  try {
    // Use the auth token cookie to identify user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Fetch only notifications for the user
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('email', userEmail)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notifications: data });
  } catch (err: unknown) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unexpected error',
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const { message, type, user_id, order_id, amount } = await request.json();

    if (!message || !type || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user's email & full name
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', user_id)
      .single();

    if (userError || !user?.email) {
      return NextResponse.json({ error: 'User not found or missing email' }, { status: 404 });
    }

    // Insert notification
    const { data: inserted, error: insertError } = await supabase
      .from('notifications')
      .insert([{ message, type, user_id, order_id, amount, email: user.email }])
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Compose notification email
    let subject = 'You have a new notification';
    let body = `Hello ${user.full_name || 'User'},\n\n`;

    switch (type) {
      case 'product_added':
        subject = 'A new product has been added';
        body += 'Check your dashboard for the newly listed product.';
        break;
      case 'product_carted':
        subject = 'A product was added to your cart';
        body += 'Check your cart to proceed to checkout.';
        break;
      case 'payment':
        subject = 'Payment Received';
        body += `We’ve received your payment of $${amount} for Order ID: ${order_id}. Thank you!`;
        break;
      default:
        body += 'There’s a new update in your account.';
    }

    body += '\n\nVisit your account to view the full details.';

    try {
      await sendEmail(user.email, subject, body);
    } catch (emailErr) {
      console.error('Error sending notification email:', emailErr);
      // Proceed anyway
    }

    return NextResponse.json({ message: 'Notification added successfully', data: inserted });
  } catch (err: unknown) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Unexpected error',
    }, { status: 500 });
  }
}
