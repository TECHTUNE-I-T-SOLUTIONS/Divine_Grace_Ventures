// app/api/notifications/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/sendEmail';

export async function GET() {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ notifications: data });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
        const { message, type, user_id, email, order_id, amount } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Missing notification message' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('notifications')
            .insert([{ message, type, user_id, email, order_id, amount }])
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Prepare email subject and HTML content based on the notification type
        if (email) {
            let subject = '';
            let htmlContent = `<p>${message}</p>`;

            switch (type) {
                case 'product_added':
                    subject = 'New Product Added to Inventory';
                    break;
                case 'product_carted':
                    subject = 'Product Added to Cart';
                    break;
                case 'admin_login':
                    subject = 'Admin Login Notification';
                    break;
                case 'user_login':
                    subject = 'Login Notification';
                    break;
                case 'payment':
                    subject = 'Payment Received Notification';
                    htmlContent = `
                        <p>${message}</p>
                        <p>Order ID: ${order_id}</p>
                        <p>User ID: ${user_id}</p>
                        <p>Amount: $${amount}</p>
                    `;
                    break;
                default:
                    subject = 'New Notification';
            }

            try {
                await sendEmail(email, subject, htmlContent);
            } catch (emailError) {
                console.error('Error sending email notification:', emailError);
            }
        }

        return NextResponse.json({ message: 'Notification added successfully', data });
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}
