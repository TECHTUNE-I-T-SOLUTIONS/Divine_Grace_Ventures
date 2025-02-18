// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  // Query our custom "users" table
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Compare provided password with the hashed password
  const isValid = await bcrypt.compare(password, user.hashed_password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Generate a JWT token that expires in 1 hour
  const token = jwt.sign(
    { id: user.id, email: user.email, userType: user.userType || 'user' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const response = NextResponse.json({ message: 'Login successful', token, user });
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // in development, secure should be false
    maxAge: 60 * 60, // 1 hour in seconds
    path: '/',
    sameSite: 'lax',
  });
  return response;
}
