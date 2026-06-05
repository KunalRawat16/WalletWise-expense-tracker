CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(100) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budgets (
    id VARCHAR(100) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    UNIQUE(user_id, category_id)
);

CREATE TABLE IF NOT EXISTS goals (
    id VARCHAR(100) PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target DECIMAL(12, 2) NOT NULL,
    current DECIMAL(12, 2) DEFAULT 0,
    deadline DATE
);

-- Insert default categories if they don't exist
INSERT INTO categories (id, user_id, name, color, is_default) VALUES
    ('housing', NULL, 'Housing & Rent', '#3b82f6', TRUE),
    ('food', NULL, 'Food & Dining', '#ef4444', TRUE),
    ('transportation', NULL, 'Transportation', '#f59e0b', TRUE),
    ('utilities', NULL, 'Utilities', '#06b6d4', TRUE),
    ('entertainment', NULL, 'Entertainment', '#8b5cf6', TRUE),
    ('shopping', NULL, 'Shopping', '#ec4899', TRUE),
    ('health', NULL, 'Health & Medical', '#10b981', TRUE)
ON CONFLICT (id) DO NOTHING;
