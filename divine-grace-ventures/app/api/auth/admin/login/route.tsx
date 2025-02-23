import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  // Retrieve the admin record from the "admins" table
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !admin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  // Verify password
  const isValid = await bcrypt.compare(password, admin.hashed_password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Generate a JWT token for the admin.
  // Ensure that you have JWT_SECRET set in your environment.
  const token = jwt.sign(
    { id: admin.id, email: admin.email, userType: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  const response = NextResponse.json({ message: 'Admin login successful', token, admin });
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600, // 1 hour in seconds
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
