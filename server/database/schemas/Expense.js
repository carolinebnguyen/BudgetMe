import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExpenseSchema = new Schema({
    budgetProfileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    monthlyBudgetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default ExpenseSchema;
