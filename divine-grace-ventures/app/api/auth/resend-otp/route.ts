// app/api/resend-otp/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendOtpEmail } from '@/lib/emailService';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update user record
    const { error } = await supabase
      .from('users')
      .update({ otp: newOtp, otp_expires_at: otpExpiresAt.toISOString() })
      .eq('email', email);

    if (error) {
      return NextResponse.json({ error: 'Failed to update OTP' }, { status: 500 });
    }

    // Send OTP email (with fallback)
    const emailResult = await sendOtpEmail(email, newOtp);

    if (!emailResult.success) {
      return NextResponse.json({ error: 'Failed to send OTP email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'A new OTP has been sent successfully.' });
  } catch (err: unknown) {
    console.error('Resend OTP error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Internal server error' }, { status: 500 });
  }
}
