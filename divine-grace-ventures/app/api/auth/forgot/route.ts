import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';

// Helper function to generate a temporary password (or OTP)
function generateTempPassword(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let tempPassword = '';
  for (let i = 0; i < length; i++) {
    tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tempPassword;
}

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    // Retrieve the user record from "users" table
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate a temporary password
    const tempPassword = generateTempPassword(8);
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);

    // Update the user's password with the temporary one
    const { error: updateError } = await supabase
      .from('users')
      .update({ hashed_password: hashedTempPassword })
      .eq('email', email);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Prepare the email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset - Divine Grace Ventures',
      text: `Your temporary password is: ${tempPassword}. Please log in and change your password immediately.`,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      if (mailError instanceof Error) {
        return NextResponse.json({ error: mailError.message }, { status: 500 });
      }
      return NextResponse.json({ error: 'Failed to send email due to unknown error' }, { status: 500 });
    }

    // Optional: Add an SMS/OTP step if needed

    return NextResponse.json({ message: 'Temporary password sent to your email' });

  } catch (error) {
    console.error('Unexpected error in forgot password flow:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
