import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';
import africastalking from 'africastalking';

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
  try {
    console.log(`Sending OTP to ${email}...`); // Log to verify function execution

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

  const emailHTML = `
    <div style="background: linear-gradient(135deg, indigo, purple); padding: 20px; color: white; text-align: center; font-family: Arial, sans-serif;">
      <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto;">
        <img src="https://i.ibb.co/jjzqRPt/logo.png" alt="Brand Logo" style="max-width: 150px; margin-bottom: 20px;">
        <h1 style="color: indigo;">DIVINE GRACE VENTURES<h1/>
        <h2 style="color: #4B0082;">Your OTP Code</h2>
        <p style="color: #333;">Your One-Time Password (OTP) is:</p>
        <h1 style="color: #8A2BE2; font-size: 24px; margin: 10px 0;">${otp}</h1>
        <p style="color: #555;">This OTP is valid for 10 minutes.</p>
        <hr style="margin: 20px 0; border: 1px solid #ddd;">
        <p>Visit our website: <a href="https://yourwebsite.com" style="color: #4B0082; text-decoration: none;">Divine Grace Ventures</a></p>
        <div style="margin-top: 20px;">
          <a href="https://wa.me/2348144409511" style="margin-right: 10px;">
            <img src="https://img.icons8.com/?size=100&id=QkXeKixybttw&format=png&color=000000" alt="WhatsApp" style="width: 30px;">
          </a>
          <a href="https://facebook.com/divine_grace_ventures">
            <img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt="Facebook" style="width: 30px;">
          </a>
        </div>
      </div>
    </div>
  `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP Code',
      html: emailHTML,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`); // Log the email response

    return { success: true };
  } catch (error) {
    console.error('Email OTP error:', error);
    return { success: false, error: error.message };
  }
}


async function sendOtpSms(phone: string, otp: string) {
  try {
    const africastalkingConfig = {
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME,
    };
    const at = africastalking(africastalkingConfig);
    const sms = at.SMS;
    await sms.send({
      to: phone,
      message: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      // sender: "YourSenderID"      
    });
    return { success: true };
  } catch (error) {
    console.error('SMS OTP error:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(request: Request) {
  let userEmail = '';
  try {
    const { email, username, password, recaptchaToken, phone } = await request.json();
    if (!email || !username || !password || !recaptchaToken || !phone) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const isHuman = await verifyRecaptcha(recaptchaToken).catch(() => false);
    if (!isHuman) {
      return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('users')
      .insert([
        { email, username, hashed_password: hashedPassword, otp, otp_expires_at: otpExpiresAt, verified: false, phone },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    userEmail = email;
    const [emailResult, smsResult] = await Promise.all([sendOtpEmail(email, otp), sendOtpSms(phone, otp)]);

    if (!emailResult.success && !smsResult.success) {
      throw new Error('OTP delivery failed');
    }

    return NextResponse.json({ message: 'OTP sent. Please verify to complete signup.', data });
  } catch (err) {
    console.error('Signup error:', err);
    if (userEmail) {
      await supabase.from('users').delete().eq('email', userEmail);
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
