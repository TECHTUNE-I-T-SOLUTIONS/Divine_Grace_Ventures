// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';
import emailjs from '@emailjs/nodejs';

// OTP generator function
function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

// ✅ Function to send OTP via EmailJS
async function sendOtpEmail(email: string, otp: string) {
  try {
    const templateParams = {
      to_email: email,
      otp_code: otp,
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.OTP_TEMPLATE_ID!,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!, // Optional but recommended
      }
    );

    return { success: true, response };
  } catch (error: unknown) {
    console.error('EmailJS OTP error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send OTP via EmailJS',
    };
  }
}

// Main POST handler
export async function POST(request: Request) {
  let userEmail = '';

  try {
    const { email, username, password, phone } = await request.json();

    if (!email || !username || !password || !phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          username,
          hashed_password: hashedPassword,
          otp,
          otp_expires_at: otpExpiresAt,
          verified: false,
          phone,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    userEmail = email;

    const emailResult = await sendOtpEmail(email, otp);
    if (!emailResult.success) {
      throw new Error(emailResult.error || 'Failed to send OTP');
    }

    return NextResponse.json({
      message: 'OTP sent. Please verify to complete signup.',
      data,
    });
  } catch (err: unknown) {
    console.error('Signup error:', err);

    if (userEmail) {
      await supabase.from('users').delete().eq('email', userEmail);
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown signup error' },
      { status: 500 }
    );
  }
}
