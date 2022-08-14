// Use environment variables for MongoDB Atlas connection
import 'dotenv/config.js';
import mongoose from 'mongoose';
import UserSchema from '#database/schemas/User.js';
import BudgetProfileSchema from '#database/schemas/BudgetProfile.js';
import ExpenseSchema from '#database/schemas/Expense.js';

const connectionURI = process.env.MONGODB_ATLAS_URI;
mongoose.connect(connectionURI);

mongoose.connection.on('connected', () => {
    console.log('Connected successfully to MongoDB!');
});

mongoose.connection.on('error', () => {
    console.log('Failed to connect to MongoDB.');
});

const User = mongoose.model('User', UserSchema);
const BudgetProfile = mongoose.model('BudgetProfile', BudgetProfileSchema);
const Expense = mongoose.model('Expense', ExpenseSchema);

export { User, BudgetProfile, Expense };
