ALTER TABLE products DROP COLUMN IF EXISTS image;
ALTER TABLE products ADD COLUMN image TEXT;
