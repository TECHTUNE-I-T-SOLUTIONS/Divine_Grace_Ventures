// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { user_id, cart, delivery_address, delivery_phone, note, delivery_date } = await request.json();
    if (!user_id || !cart || !delivery_address || !delivery_phone || !delivery_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Calculate total amount (assumes each cart item has price and quantity)
    const total = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    // Insert new order
    const { data: order, error } = await supabase
      .from('orders')
      .insert([
        { user_id, order_items: cart, total, delivery_address, delivery_phone, note, delivery_date }
      ])
      .single();
    if (error) throw error;
    // Clear the user's cart items
    const { error: clearError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);
    if (clearError) console.error('Error clearing cart:', clearError.message);
    return NextResponse.json({ message: 'Order created successfully', order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// API (PUT) endpoint to accept changes for delivery_date
export async function PUT(request: Request) {
  try {
    const { id, delivery_date } = await request.json();
    const { data, error } = await supabase
      .from('orders')
      .update({ delivery_date, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Order updated successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders });
}
