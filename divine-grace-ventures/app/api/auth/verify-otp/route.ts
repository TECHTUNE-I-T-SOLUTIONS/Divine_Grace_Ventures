import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // Retrieve user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('otp, otp_expires_at, verified')
      .eq('email', email)
      .maybeSingle(); // `maybeSingle()` ensures it doesn't throw an error if no record is found

    if (error || !user) {
      console.error('User lookup error:', error);
      return NextResponse.json({ error: 'User not found or database error' }, { status: 404 });
    }

    // Validate OTP
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Check OTP expiration
    const now = new Date();
    const otpExpiration = user.otp_expires_at ? new Date(user.otp_expires_at) : null;

    if (!otpExpiration || otpExpiration < now) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // Mark user as verified and clear OTP fields
    const { error: updateError } = await supabase
      .from('users')
      .update({ verified: true, otp: null, otp_expires_at: null })
      .eq('email', email);

    if (updateError) {
      console.error('User update error:', updateError);
      return NextResponse.json({ error: 'Failed to verify user' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
