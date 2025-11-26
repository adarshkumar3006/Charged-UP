const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/workout', require('./routes/workout'));
app.use('/api/diet', require('./routes/diet'));
app.use('/api/progress', require('./routes/progress'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Charged Up API is running' });
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chargedup';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('MongoDB Connected');
  console.log('Database:', MONGODB_URI);
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  console.error('Please make sure MongoDB is running and the connection string is correct.');
  console.error('Connection string:', MONGODB_URI);
  console.error('\nTo start MongoDB on Windows:');
  console.error('  net start MongoDB');
  console.error('\nTo start MongoDB on Mac/Linux:');
  console.error('  mongod');
  console.error('\nServer will continue running but database operations will fail until MongoDB is connected.');
});

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});

