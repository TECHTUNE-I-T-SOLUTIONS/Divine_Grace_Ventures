CREATE TABLE IF NOT EXISTS public.payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,         -- Reference to the order (if needed)
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL,     -- e.g., 'Paid', 'Pending', 'Failed'
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
