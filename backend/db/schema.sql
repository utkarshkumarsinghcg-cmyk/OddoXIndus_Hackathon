-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS Products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Warehouses Table
CREATE TABLE IF NOT EXISTS Warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Inventory Table
CREATE TABLE IF NOT EXISTS Inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(id),
    warehouse_id INTEGER REFERENCES Warehouses(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, warehouse_id)
);

-- 5. Receipts Table
CREATE TABLE IF NOT EXISTS Receipts (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(id),
    warehouse_id INTEGER REFERENCES Warehouses(id),
    quantity INTEGER NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Deliveries Table
CREATE TABLE IF NOT EXISTS Deliveries (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(id),
    warehouse_id INTEGER REFERENCES Warehouses(id),
    quantity INTEGER NOT NULL,
    customer VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Transfers Table
CREATE TABLE IF NOT EXISTS Transfers (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(id),
    from_warehouse INTEGER REFERENCES Warehouses(id),
    to_warehouse INTEGER REFERENCES Warehouses(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Adjustments Table
CREATE TABLE IF NOT EXISTS Adjustments (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(id),
    warehouse_id INTEGER REFERENCES Warehouses(id),
    old_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Ledger Table (Movement History)
CREATE TABLE IF NOT EXISTS Ledger (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'RECEIPT', 'DELIVERY', 'TRANSFER_OUT', 'TRANSFER_IN', 'ADJUSTMENT'
    product_id INTEGER REFERENCES Products(id),
    warehouse_id INTEGER REFERENCES Warehouses(id),
    quantity INTEGER NOT NULL, -- Can be positive or negative
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Dummy Data for Testing in Postman
-- Run these one by one or all together if your tool allows it.

INSERT INTO Users (name, email) VALUES 
('Alice Smith', 'alice@test.com'),
('Bob Jones', 'bob@test.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO Products (name, description, price)
SELECT 'Steel Rod', '10mm Steel Rod', 15.50 WHERE NOT EXISTS (SELECT 1 FROM Products WHERE name = 'Steel Rod');

INSERT INTO Products (name, description, price)
SELECT 'Cement Bag', '50kg Portland Cement', 8.00 WHERE NOT EXISTS (SELECT 1 FROM Products WHERE name = 'Cement Bag');

INSERT INTO Warehouses (name, location)
SELECT 'Main Warehouse', 'New York' WHERE NOT EXISTS (SELECT 1 FROM Warehouses WHERE name = 'Main Warehouse');

INSERT INTO Warehouses (name, location)
SELECT 'Backup Storage', 'New Jersey' WHERE NOT EXISTS (SELECT 1 FROM Warehouses WHERE name = 'Backup Storage');

-- Initial Inventory (upsert so re-running is safe)
INSERT INTO Inventory (product_id, warehouse_id, quantity) VALUES 
(1, 1, 100),
(2, 1, 50)
ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = EXCLUDED.quantity;
