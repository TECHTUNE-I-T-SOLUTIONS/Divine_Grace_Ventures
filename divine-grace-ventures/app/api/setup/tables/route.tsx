import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(_request: Request) { // Renamed request to _request to avoid ESLint warning
  const connectionString = process.env.SUPABASE_DB_CONNECTION;

  if (!connectionString) {
    return NextResponse.json({ error: 'Database connection string is not set.' }, { status: 500 });
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();

    // Check if the "admins" table exists and create it if not.
    const resAdmins = await client.query("SELECT to_regclass('public.admins') as table_exists;");
    if (!resAdmins.rows[0].table_exists) {
      await client.query(`
        CREATE TABLE public.admins (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          username TEXT NOT NULL,
          hashed_password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }

    // Check if the "users" table exists and create it if not.
    const resUsers = await client.query("SELECT to_regclass('public.users') as table_exists;");
    if (!resUsers.rows[0].table_exists) {
      await client.query(`
        CREATE TABLE public.users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          username TEXT NOT NULL,
          hashed_password TEXT NOT NULL,
          orders JSONB,
          transactions JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
    }

    await client.end();
    return NextResponse.json({ message: 'Tables created (or already exist).' });
  } catch (error: unknown) { // Changed 'any' to 'unknown'
    console.error('Error setting up tables:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
