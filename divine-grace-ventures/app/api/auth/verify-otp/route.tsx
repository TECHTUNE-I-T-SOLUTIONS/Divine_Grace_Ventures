// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Retrieve user record by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check OTP and expiration
    const now = new Date();
    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }
    if (new Date(user.otp_expires_at) < now) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    // Mark user as verified and clear OTP fields
    const { data, error: updateError } = await supabase
      .from('users')
      .update({ verified: true, otp: null, otp_expires_at: null })
      .eq('email', email)
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'User verified successfully', data });
  } catch (err: any) {
    console.error('OTP verification error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
