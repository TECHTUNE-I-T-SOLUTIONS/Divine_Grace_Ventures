// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ products: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Destructure the additional fields: unit and unit_price
    const { name, price, available, image, quantity, unit, unit_price } = await request.json();
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, price, available, image, quantity, unit, unit_price }])
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Product added successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Also include unit and unit_price in the update
    const { id, name, price, available, quantity, image, unit, unit_price } = await request.json();
    const { data, error } = await supabase
      .from('products')
      .update({ name, price, available, quantity, image, unit, unit_price })
      .eq('id', id)
      .select() // force the updated row to be returned
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: 'No product returned after update' }, { status: 500 });
    return NextResponse.json({ message: 'Product updated successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Product deleted successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
