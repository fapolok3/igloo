-- SQL Schema for Igloo Order Management with RLS Policies

-- 1. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    clientName TEXT NOT NULL,
    phone TEXT,
    product TEXT NOT NULL,
    source TEXT NOT NULL,
    assignedPerson TEXT NOT NULL,
    qty NUMERIC NOT NULL DEFAULT 1,
    unitPrice NUMERIC NOT NULL DEFAULT 0,
    totalAmount NUMERIC NOT NULL,
    notes TEXT,
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create members table
CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for Public Access (Allowing anon key to read/write)
-- For orders
DO $$ BEGIN
    CREATE POLICY "Public Read/Write Access" ON orders FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- For products
DO $$ BEGIN
    CREATE POLICY "Public Read/Write Access" ON products FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- For members
DO $$ BEGIN
    CREATE POLICY "Public Read/Write Access" ON members FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
