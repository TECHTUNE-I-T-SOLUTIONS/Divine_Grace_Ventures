import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  // Fetch user from Supabase
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Validate password
  const isValid = await bcrypt.compare(password, user.hashed_password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Check if the user has settings in `user_settings`
  const { data: existingSettings, error: settingsError } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // If no settings exist, create default settings for the user
  if (!existingSettings || settingsError) {
    const { error: insertError } = await supabase.from('user_settings').insert([
      {
        user_id: user.id,
        email_notifications: true,
        sms_notifications: true,
        dark_mode: false,
      },
    ]);

    if (insertError) {
      console.error('Error inserting default settings:', insertError.message);
      return NextResponse.json({ error: 'Failed to create default settings' }, { status: 500 });
    }
  }

  // Update user's online status
  await supabase.from('users').update({ is_online: true }).eq('id', user.id);

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, userType: user.userType || 'user' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  // Create response
  const response = NextResponse.json({ message: 'Login successful', token, user });

  // Manually set cookie header
  response.headers.set(
    'Set-Cookie',
    `auth-token=${token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; Path=/; Max-Age=3600; SameSite=Lax`
  );

  return response;
}
