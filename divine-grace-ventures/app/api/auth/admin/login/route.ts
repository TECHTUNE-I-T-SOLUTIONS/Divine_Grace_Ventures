import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !admin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, admin.hashed_password);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const { error: updateError } = await supabase
    .from('admins')
    .update({ is_active: true })
    .eq('id', admin.id);

  if (updateError) {
    console.error('Error updating admin is_active status:', updateError.message);
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, userType: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  // Create response
  const response = NextResponse.json({
    message: 'Admin login successful',
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  });

  // Set cookies on the response
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    sameSite: 'lax',
    path: '/',
  });

  response.cookies.set('admin_id', admin.id.toString(), {  // Ensure it's a string
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    sameSite: 'lax',
    path: '/',
  });

  response.cookies.set('admin_email', admin.email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
