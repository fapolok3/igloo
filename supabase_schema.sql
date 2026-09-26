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

-- 6. Create kb_items table (FB Customer Reply Knowledge Base)
CREATE TABLE IF NOT EXISTS kb_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'general',
    categoryLabel TEXT NOT NULL DEFAULT 'General FAQs',
    topic TEXT NOT NULL,
    question TEXT,
    englishReply TEXT NOT NULL,
    banglaReply TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    isCustom BOOLEAN DEFAULT true,
    createdAt TIMESTAMPTZ DEFAULT NOW(),
    updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for kb_items
ALTER TABLE kb_items ENABLE ROW LEVEL SECURITY;

-- Policy for kb_items (Public Read/Write Access for anon key)
DO $$ BEGIN
    CREATE POLICY "Public Read/Write Access" ON kb_items FOR ALL USING (true) WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_kb_items_category ON kb_items(category);
CREATE INDEX IF NOT EXISTS idx_kb_items_topic ON kb_items(topic);
