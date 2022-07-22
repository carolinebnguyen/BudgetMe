import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExpenseSchema = new Schema({
    expenseName: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
});

const Expense = mongoose.model('Expense', ExpenseSchema);

export default Expense;
