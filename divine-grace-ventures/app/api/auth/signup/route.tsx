// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

async function verifyRecaptcha(token: string, remoteip?: string) {
  const secret = RECAPTCHA_SECRET;
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}${remoteip ? `&remoteip=${remoteip}` : ''}`,
    { method: 'POST' }
  );
  const data = await res.json();
  return data.success;
}

function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

async function sendOtpSms(phone: string, otp: string) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return client.messages.create({
    body: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}

export async function POST(request: Request) {
  try {
    const { email, username, password, recaptchaToken, phone } = await request.json();
    if (!email || !username || !password || !recaptchaToken || !phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiration
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Insert user record into the "users" table
    const { data, error } = await supabase
      .from('users')
      .insert([
        { email, username, hashed_password: hashedPassword, otp, otp_expires_at: otpExpiresAt, verified: false, phone },
      ])
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send OTP via email and SMS
    await sendOtpEmail(email, otp);
    await sendOtpSms(phone, otp);

    return NextResponse.json({ message: 'OTP sent. Please verify to complete signup.', data });
  } catch (err: any) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
