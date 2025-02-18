-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop the orders table if it exists (for a fresh start; be cautious in production)
DROP TABLE IF EXISTS public.orders;

-- Create the orders table with additional columns
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  order_items JSONB NOT NULL,  -- JSON array of items from the cart
  total NUMERIC NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_phone TEXT NOT NULL,
  note TEXT,
  delivery_date TIMESTAMPTZ NOT NULL,  -- Expected delivery date
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update the cart_items table with additional columns for production
ALTER TABLE public.cart_items
  ADD COLUMN IF NOT EXISTS price NUMERIC,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
