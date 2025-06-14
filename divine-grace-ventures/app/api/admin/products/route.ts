import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { sendProductAlertEmail } from '@/lib/emailService';

export async function GET() {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw new Error(error.message);
    return NextResponse.json({ products: data });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, available, image, quantity, unit, unit_price } = await request.json();
    
    const { data: product, error } = await supabase.from('products').insert([
      { name, price, available, image, quantity, unit, unit_price }
    ]).select().single();

    if (error) throw new Error(error.message);

    const { data: users, error: userError } = await supabase.from('users').select('email');
    if (userError) throw new Error(userError.message);

    // Send notifications
    await Promise.all(users.map((user) => {
      return sendProductAlertEmail(user.email, { ...product, name, price, image, quantity, unit });
    }));

    return NextResponse.json({ message: 'Product added successfully. Notifications sent.', product });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, price, available, quantity, image, unit, unit_price } = await request.json();
    const { data, error } = await supabase.from('products')
      .update({ name, price, available, quantity, image, unit, unit_price })
      .eq('id', id)
      .select().single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ message: 'Product updated successfully', data });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { data, error } = await supabase.from('products').delete().eq('id', id).single();
    if (error) throw new Error(error.message);
    return NextResponse.json({ message: 'Product deleted successfully', data });
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown) {
  if (err instanceof Error) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
}
