require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Route imports
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const userRoutes = require('./routes/userRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const adjustmentRoutes = require('./routes/adjustmentRoutes');
const moveRoutes = require('./routes/moveRoutes');
const inventoryStockRoutes = require('./routes/inventoryStockRoutes');
const reorderRuleRoutes = require('./routes/reorderRuleRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── V1 Routes ──────────────────────────────────────────────────────────────
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/warehouses', warehouseRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/receipts', receiptRoutes);
app.use('/api/v1/deliveries', deliveryRoutes);
app.use('/api/v1/transfers', require('./routes/transferRoutes'));
app.use('/api/v1/adjustments', adjustmentRoutes);
app.use('/api/v1/moves', moveRoutes);
app.use('/api/v1/inventory', inventoryStockRoutes);
app.use('/api/v1/reorder-rules', reorderRuleRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Oddo Inventory V1 Backend is running',
        port: PORT
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
