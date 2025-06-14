import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

// OTP generator function
function generateOtp(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
}

// Function to send OTP via Termii Email
async function sendOtpEmail(email: string, otp: string) {
    try {
        const data = {
            api_key: process.env.TERMII_API_KEY,
            email_address: email,
            code: otp,
            email_configuration_id: process.env.TERMII_EMAIL_CONFIG_ID,
        };

        const response = await fetch('https://api.ng.termii.com/api/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to send OTP email' };
        }

        return { success: true };
    } catch (error: unknown) {
        console.error('Termii Email OTP error:', error);

        if (error instanceof Error) {
            return { success: false, error: error.message };
        }

        return { success: false, error: 'Unknown error occurred while sending OTP email' };
    }
}

// Function to send OTP via Termii SMS
async function sendOtpSms(phone: string, otp: string) {
    try {
        const data = {
            api_key: process.env.TERMII_API_KEY,
            to: phone,
            sms: `Your OTP is ${otp}. It will expire in 10 minutes.`,
            from: process.env.TERMII_SMS_SENDER_ID,
            type: 'plain',
            channel: 'generic',
        };

        const response = await fetch('https://api.ng.termii.com/api/sms/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            return { success: false, error: result.message || 'Failed to send OTP SMS' };
        }

        return { success: true };
    } catch (error: unknown) {
        console.error('Termii SMS OTP error:', error);

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
            return NextResponse.json({ error: error.message }, { status:500 });
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

        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }

        return NextResponse.json({ error: 'Unknown error occurred during signup' }, { status: 500 });
    }
}
