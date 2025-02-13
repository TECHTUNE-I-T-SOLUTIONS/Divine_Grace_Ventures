// app/api/auth/admin/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
  }

  // Retrieve the admin record from "admins" table
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

  // (Optional) Generate and return a session token here

  return NextResponse.json({ message: 'Admin login successful', admin });
}
