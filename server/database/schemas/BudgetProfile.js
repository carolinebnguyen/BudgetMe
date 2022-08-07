import mongoose from 'mongoose';
import MonthlyBudgetSchema from './MonthlyBudget.js';
import ExpenseCategorySchema from './ExpenseCategory.js';
const { Schema } = mongoose;

// const generateObjectId = () => {
//     const ObjectId = mongoose.Types.ObjectId;
//     return new ObjectId();
// };

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
