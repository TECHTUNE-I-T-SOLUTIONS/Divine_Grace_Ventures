// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import nodemailer from 'nodemailer';

export async function GET(request: Request) {
  try {
    const { data, error } = await supabase.from('products').select('*');
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
    const { name, price, available, image, quantity, unit, unit_price } = await request.json();

    // Insert into the products table
    const { data, error } = await supabase.from('products').insert([
      { name, price, available, image, quantity, unit, unit_price }
    ]).select().single();

    if (error) {
      console.error('Supabase Insert Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Inserted product:', data);

    // Fetch all registered users
    const { data: users, error: userError } = await supabase.from('users').select('email');
    if (userError) {
      console.error('Supabase Fetch Users Error:', userError.message);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    console.log('Fetched users:', users);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true', // true for SSL (465), false for TLS (587)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailHTML = `
      <div style="background: linear-gradient(135deg, indigo, purple); padding: 20px; color: white; text-align: center; font-family: Arial, sans-serif;">
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto;">
          <img src="https://i.ibb.co/jjzqRPt/logo.png" alt="Brand Logo" style="max-width: 50px; margin-bottom: 5px;">
          <h1 style="color: indigo;">DIVINE GRACE VENTURES</h1>      
          <h1 style="color: indigo;">NEW PRODUCT ALERT</h1>
          <img src="${image}" alt="${name}" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;">
          <h2 style="color: #4B0082;">${name}</h2>
          <p style="color: #333; font-size: 18px;">Price: <strong>${price}</strong></p>
          <p style="color: #555;">Available Quantity: ${quantity} ${unit}</p>
          <a href="https://yourwebsite.com/product/${data.id}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background: #8A2BE2; color: white; text-decoration: none; border-radius: 5px;">View Product</a>
          <hr style="margin: 20px 0; border: 1px solid #ddd;">
          <p>Visit our website: <a href="https://yourwebsite.com" style="color: #4B0082; text-decoration: none;">DIVINE GRACE VENTURES</a></p>
          <div style="margin-top: 5px;">
            <a href="https://wa.me/2348144409511" style="margin-right: 10px;">
              <img src="https://img.icons8.com/?size=100&id=QkXeKixybttw&format=png&color=000000" alt="WhatsApp" style="width: 30px;">
            </a>
            <a href="https://facebook.com/divine_grace_ventures">
              <img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt="Facebook" style="width: 30px;">
            </a>
          </div>    
        </div>
      </div>
    `;

    return NextResponse.json({ message: 'Product added successfully, notifications will be sent soon.', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  (async () => {
    for (const user of users) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `New Product Available: ${name}`,
        html: emailHTML,
      }).catch(err => console.error('Email Send Error:', err));
    }
  })();  
}

export async function PUT(request: Request) {
  try {
    const { id, name, price, available, quantity, image, unit, unit_price } = await request.json();
    const { data, error } = await supabase.from('products').update({ name, price, available, quantity, image, unit, unit_price }).eq('id', id).select().single();
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
    const { data, error } = await supabase.from('products').delete().eq('id', id).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: 'Product deleted successfully', data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
