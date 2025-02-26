import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendOtpEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Update OTP in the database
    const { error } = await supabase
      .from('users')
      .update({ otp: newOtp, otp_expires_at: otpExpiresAt })
      .eq('email', email);

    if (error) {
      return NextResponse.json({ error: 'Failed to update OTP' }, { status: 500 });
    }

    // Send OTP email
    const emailResponse = await sendOtpEmail(email, newOtp);
    if (!emailResponse.success) {
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'A new OTP has been sent successfully.' });
  } catch (err: unknown) {  // Use 'unknown' instead of 'any'
    console.error('Resend OTP error:', err);
    
    if (err instanceof Error) {
      // If the error is an instance of Error, you can access error.message
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    // Fallback if the error is not an instance of Error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
