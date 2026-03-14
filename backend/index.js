require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route imports
const inventoryRoutes = require('./routes/inventoryRoutes');
const productRoutes = require('./routes/productRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/inventory', inventoryRoutes);   // Inventory Operations
app.use('/api/products', productRoutes);       // Products CRUD
app.use('/api/warehouses', warehouseRoutes);   // Warehouses CRUD
app.use('/api/users', userRoutes);             // Users CRUD

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Inventory Backend is running',
        port: PORT,
        routes: [
            'GET  /health',
            '--- INVENTORY OPS ---',
            'POST /api/inventory/receipts',
            'POST /api/inventory/delivery',
            'POST /api/inventory/transfer',
            'POST /api/inventory/adjustment',
            'GET  /api/inventory/inventory-history',
            '--- PRODUCTS ---',
            'GET    /api/products',
            'GET    /api/products/:id',
            'POST   /api/products',
            'PUT    /api/products/:id',
            'DELETE /api/products/:id',
            '--- WAREHOUSES ---',
            'GET    /api/warehouses',
            'GET    /api/warehouses/:id',
            'POST   /api/warehouses',
            'PUT    /api/warehouses/:id',
            'DELETE /api/warehouses/:id',
            '--- USERS ---',
            'GET    /api/users',
            'GET    /api/users/:id',
            'POST   /api/users',
            'PUT    /api/users/:id',
            'DELETE /api/users/:id',
        ]
    });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
});
