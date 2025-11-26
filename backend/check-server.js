// Quick script to check if server and MongoDB are working
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chargedup';

console.log('Checking MongoDB connection...');
console.log('Connection string:', MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('✅ MongoDB Connected successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('❌ MongoDB connection failed!');
  console.error('Error:', err.message);
  console.error('\nTo fix this:');
  console.error('1. Make sure MongoDB is installed');
  console.error('2. Start MongoDB service:');
  console.error('   Windows: net start MongoDB');
  console.error('   Mac/Linux: mongod');
  console.error('3. Check if the connection string is correct in .env file');
  process.exit(1);
});

