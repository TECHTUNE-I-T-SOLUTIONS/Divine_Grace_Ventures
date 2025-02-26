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

  // Update admin's is_active to true
  const { error: updateError } = await supabase
    .from('admins')
    .update({ is_active: true })
    .eq('id', admin.id);
    
  if (updateError) {
    console.error('Error updating admin is_active status:', updateError.message);
  }

  // Generate a JWT token for the admin.
  const token = jwt.sign(
    { id: admin.id, email: admin.email, userType: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  // Create response object
  const response = NextResponse.json({ 
    message: 'Admin login successful', 
    token, 
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    } 
  });

  // Set multiple cookies (auth-token, admin ID, and email)
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600, // 1 hour
    path: '/',
    sameSite: 'lax',
  });

  response.cookies.set('admin_id', admin.id, {
    httpOnly: false, // Can be accessed by frontend scripts if needed
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    path: '/',
    sameSite: 'lax',
  });

  response.cookies.set('admin_email', admin.email, {
    httpOnly: false, // Can be accessed by frontend scripts
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
