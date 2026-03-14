const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');
const supabase = require('./utils/supabase');


// Load environment variables
dotenv.config();

const app = express();

if (supabase) {
  console.log('✅ Supabase Client Initialized');
} else {
  console.warn('⚠️ Supabase Client NOT Initialized (Missing credentials)');
}


// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
