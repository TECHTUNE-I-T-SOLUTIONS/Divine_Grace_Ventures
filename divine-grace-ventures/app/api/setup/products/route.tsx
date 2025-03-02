import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST() { // Removed _request parameter
  const connectionString = process.env.SUPABASE_DB_CONNECTION;

  if (!connectionString) {
    return NextResponse.json({ error: 'Database connection string not set.' }, { status: 500 });
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();

    // Check if the products table exists
    const res = await client.query("SELECT to_regclass('public.products') as table_exists");
    if (!res.rows[0].table_exists) {
      // Create the products table if it doesn't exist
      await client.query(`
        CREATE TABLE public.products (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          price NUMERIC(10,2) NOT NULL,
          available BOOLEAN DEFAULT TRUE,
          quantity INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    }

    await client.end();
    return NextResponse.json({ message: 'Products table created or already exists.' });
  } catch (error: unknown) {
    await client.end();
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
