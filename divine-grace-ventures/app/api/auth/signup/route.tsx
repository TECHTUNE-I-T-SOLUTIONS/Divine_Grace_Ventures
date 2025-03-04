import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';
import africastalking from 'africastalking';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

// Function to verify reCAPTCHA
async function verifyRecaptcha(token: string, remoteip?: string) {
    const secret = RECAPTCHA_SECRET;
    const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}${remoteip ? `&remoteip=${remoteip}` : ''}`,
        { method: 'POST' }
    );
    const data = await res.json();
    return data.success;
}

// OTP generator function
function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

// Function to send OTP via email
async function sendOtpEmail(email: string, otp: string) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const emailHTML = `
            <div style="background: linear-gradient(135deg, indigo, purple); padding: 20px; color: white; text-align: center; font-family: Arial, sans-serif;">
                <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto;">
                    <img src="https://i.ibb.co/jjzqRPt/logo.png" alt="Brand Logo" style="max-width: 150px; margin-bottom: 20px;">
                    <h1 style="color: indigo;">DIVINE GRACE VENTURES</h1>
                    <h2 style="color: #4B0082;">Your OTP Code</h2>
                    <p style="color: #333;">Your One-Time Password (OTP) is:</p>
                    <h1 style="color: #8A2BE2; font-size: 24px; margin: 10px 0;">${otp}</h1>
                    <p style="color: #555;">This OTP is valid for 10 minutes.</p>
                    <hr style="margin: 20px 0; border: 1px solid #ddd;">
                    <p>Visit our website: <a href="https://yourwebsite.com" style="color: #4B0082; text-decoration: none;">Divine Grace Ventures</a></p>
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
        console.log(`Email sent: ${info.response}`);

        return { success: true };
    } catch (error: unknown) {
        console.error('Email OTP error:', error);

        // Use a type guard to check for proper error object
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: 'Unknown error occurred while sending OTP email' };
    }
}

// Function to send OTP via SMS
async function sendOtpSms(phone: string, otp: string) {
    try {
        const africastalkingConfig = {
            apiKey: process.env.AT_API_KEY!,
            username: process.env.AT_USERNAME!,
        };

        const at = africastalking(africastalkingConfig);
        const sms = at.SMS;

        await sms.send({
            to: phone,
            message: `Your OTP is ${otp}. It will expire in 10 minutes.`,
        });

        return { success: true };
    } catch (error: unknown) {
        console.error('SMS OTP error:', error);

        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: 'Unknown error occurred while sending OTP SMS' };
    }
}

// Main POST handler
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

        const [emailResult, smsResult] = await Promise.all([
            sendOtpEmail(email, otp),
            sendOtpSms(phone, otp),
        ]);

        if (!emailResult.success && !smsResult.success) {
            throw new Error('OTP delivery failed');
        }

        return NextResponse.json({ message: 'OTP sent. Please verify to complete signup.', data });
    } catch (err: unknown) {
        console.error('Signup error:', err);

        if (userEmail) {
            await supabase.from('users').delete().eq('email', userEmail);
        }

        // Check for known error type
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'Unknown error occurred during signup' }, { status: 500 });
    }
}
