CREATE TABLE IF NOT EXISTS farmers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS buyers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  farmer_id INTEGER NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL CHECK (quantity_kg > 0),
  expected_price_per_kg NUMERIC NOT NULL CHECK (expected_price_per_kg >= 0),
  harvest_date DATE NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id INTEGER NOT NULL REFERENCES buyers(id) ON DELETE CASCADE,
  quantity_kg NUMERIC NOT NULL CHECK (quantity_kg > 0),
  agreed_price_per_kg NUMERIC NOT NULL CHECK (agreed_price_per_kg >= 0),
  status TEXT NOT NULL DEFAULT 'PLACED',
  created_at TIMESTAMP DEFAULT NOW()
);
