// Use environment variables for MongoDB Atlas connection
import 'dotenv/config.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import Expense from './models/Expense.js';

const connectionURI = process.env.MONGODB_ATLAS_URI;
mongoose.connect(connectionURI);

mongoose.connection.on('connected', () => {
    console.log('Connected successfully to MongoDB!');
});

mongoose.connection.on('error', () => {
    console.log('Failed to connect to MongoDB.');
});

export { User, Expense };
