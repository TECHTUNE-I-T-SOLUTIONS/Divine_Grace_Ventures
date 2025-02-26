import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  user_quantity?: number;
}

export async function POST(request: Request) {
  try {
    const {
      user_id,
      cart, // an array of cart items
      payment_reference,
      delivery_address,
      delivery_phone,
      payer_name,
      note
    } = await request.json();

    if (!user_id || !cart || !payment_reference || !delivery_address || !delivery_phone || !payer_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate total amount from cart items
    const total = cart.reduce((acc: number, item: CartItem) => {
      const qty = item.user_quantity || item.quantity || 0;
      return acc + (item.price * qty);
    }, 0);

    // Insert order record into orders table
    const orderRes = await supabase
      .from('orders')
      .insert([
        {
          user_id,
          order_items: cart,
          total,
          delivery_address,
          delivery_phone,
          payer_name,
          note,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (orderRes.error) throw orderRes.error;
    if (!orderRes.data || orderRes.data.length === 0) {
      throw new Error("No order returned after insert");
    }
    const orderData = orderRes.data[0];

    // Insert payment record into payments table
    const paymentRes = await supabase
      .from('payments')
      .insert([
        {
          order_id: orderData.id,
          user_id,
          payment_reference,
          payer_name,
          amount: total,
          delivery_address,
          delivery_phone,
          note,
          payment_date: new Date().toISOString(),
          status: 'successful',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (paymentRes.error) throw paymentRes.error;
    if (!paymentRes.data || paymentRes.data.length === 0) {
      throw new Error("No payment returned after insert");
    }
    const paymentData = paymentRes.data[0];

    // Clear the user's cart
    const deleteRes = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (deleteRes.error) throw deleteRes.error;

    return NextResponse.json({
      message: 'Order created successfully',
      order: orderData,
      payment: paymentData
    });
  } catch (err: unknown) {  // Changed `any` to `unknown`
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    // For admin view, when no user_id is provided, return all orders with payment details
    let query = supabase
      .from('orders')
      .select(`*, payments:payments(*)`)  // join the payments table
      .order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ orders: data });
  } catch (err: unknown) { // Changed `any` to `unknown`
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Order status updated successfully', data });
  } catch (err: unknown) {  // Changed `any` to `unknown`
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
