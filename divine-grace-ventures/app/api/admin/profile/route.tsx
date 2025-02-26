import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function GET() {
  // Await cookies() since it's now async
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const adminId = (decoded as any).id;
    
    // Fetch admin details from the "admins" table
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', adminId)
      .single();
      
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json({ admin: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const adminId = (decoded as any).id;
    const { full_name, phone, password } = await request.json();
    const payload: any = { full_name, phone };
    
    // If a new password is provided, update it via Supabase Auth
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
