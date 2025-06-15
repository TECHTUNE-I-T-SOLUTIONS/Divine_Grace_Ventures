// app/api/forgot/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';
import { sendEmail } from '@/lib/sendEmail'; // ✅ Import reusable email sender

function generateTempPassword(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let tempPassword = '';
  for (let i = 0; i < length; i++) {
    tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tempPassword;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const tempPassword = generateTempPassword(8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const { error: updateError } = await supabase
      .from('users')
      .update({ hashed_password: hashedPassword })
      .eq('email', email);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // ✅ Use the shared sendEmail function
    const subject = 'Password Reset';
    const htmlMessage = `
      <p>We received a request to reset your password.</p>
      <p>Your new password is: <strong>${tempPassword}</strong></p>
      <p>Please keep it safe and secure as we're not liable for any unauthorised actions performed on your account as a result of this</p>
      <p>Moreover, we'll do our best to keep your account safe</p>
      <p>Regards,<br>Divine Grace Ventures Team</p>
    `;

    const result = await sendEmail(email, subject, htmlMessage);

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Temporary password sent to your email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
