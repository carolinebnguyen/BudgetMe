import mongoose from 'mongoose';
import MonthlyBudgetSchema from '#database/schemas/MonthlyBudget.js';
import ExpenseCategorySchema from '#database/schemas/ExpenseCategory.js';
const { Schema } = mongoose;

const BudgetProfileSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    monthlyBudgets: [MonthlyBudgetSchema],
    expenseCategories: [ExpenseCategorySchema],
});

export default BudgetProfileSchema;
