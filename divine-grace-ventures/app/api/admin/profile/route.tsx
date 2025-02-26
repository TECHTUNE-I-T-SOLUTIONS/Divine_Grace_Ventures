import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

// Define types for better type checking
interface JwtPayload {
  id: string;
}

interface AdminPayload {
  full_name?: string;
  phone?: string;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const adminId = decoded.id;

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ admin: data });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const adminId = decoded.id;
    const { full_name, phone, password } = await request.json();
    const payload: AdminPayload = { full_name, phone };

    if (password) {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    const { data, error } = await supabase
      .from('admins')
      .update(payload)
      .eq('id', adminId)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Admin profile updated successfully', data });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 401 });
  }
}
