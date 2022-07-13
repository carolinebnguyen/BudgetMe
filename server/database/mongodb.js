import mongoose from 'mongoose';
import User from './models/user.js';
import Expense from './models/expense.js';

// Use environment variables for MongoDB Atlas connection
import 'dotenv/config';

const connectionUri = process.env.MONGODB_ATLAS_URI;
mongoose.connect(connectionUri);

mongoose.connection.on('connected', () => {
  console.log('Connected successfully to MongoDB!');
});

mongoose.connection.on('error', () => {
  console.log('Failed to connect to MongoDB.');
});

export { User, Expense };
