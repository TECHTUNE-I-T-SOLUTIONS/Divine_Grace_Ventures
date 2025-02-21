// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }
  // Join cart_items with products so that you get the product details (including unit, unit_price, etc.)
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      user_id,
      product_id,
      user_quantity,
      note,
      price,
      unit,
      image,
      unit_price,
      products:products (
        name, image, price, available, unit, unit_price
      )
    `)
    .eq('user_id', user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ cart: data });
}

export async function POST(request: Request) {
  try {
    // Extract fields from the request body.
    const {
      user_id,
      product_id,
      user_quantity,
      note,
      price,
      unit,
      image,
      unit_price,
    } = await request.json();

    // Check that required fields are provided
    if (!user_id || !product_id || user_quantity == null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert a new cart item.
    const { data, error } = await supabase
      .from('cart_items')
      .insert([
        {
          user_id,
          product_id,
          user_quantity,
          note: note || '',
          price: price || null,
          unit: unit || '',
          image: image || '',
          unit_price: unit_price || null,
        },
      ])
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Item added to cart',
      cartItem: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing cart item id' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .single();
    if (error) throw error;
    return NextResponse.json({ message: 'Item removed from cart', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
