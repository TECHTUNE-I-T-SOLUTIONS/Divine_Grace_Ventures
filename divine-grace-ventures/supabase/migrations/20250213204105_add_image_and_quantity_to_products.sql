DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='products' 
      AND column_name='image'
  ) THEN
    ALTER TABLE public.products ADD COLUMN image TEXT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name='products' 
      AND column_name='quantity'
  ) THEN
    ALTER TABLE public.products ADD COLUMN quantity INTEGER DEFAULT 0;
  END IF;
END $$;
