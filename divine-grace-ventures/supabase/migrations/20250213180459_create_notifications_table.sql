-- Create the notifications table to store notification messages
CREATE TABLE IF NOT EXISTS public.notifications (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  order_id INTEGER, -- optional: reference to an order if needed
  user_id INTEGER,  -- optional: reference to a user if needed
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
