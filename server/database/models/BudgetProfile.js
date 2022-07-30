import mongoose from 'mongoose';
const { Schema } = mongoose;

const BudgetProfileSchema = new Schema({
    // pointer to user id
    totalMonthlyBudget: {
        // add default budget
        // change to list of totalMonthlyBudgets, with Month/Yr + Amount
        type: Number,
        required: true,
    },
    // expense categories -> add category, get category, edit category, delete category
    // list of expenses -> add expense, get expense, edit expense, delete expense | each expense has a name, category, cost, date
    // calculate remaining budget based on totalMonthlyBudget - sum(expenses in a month)
});

const BudgetProfile = mongoose.model('BudgetProfile', BudgetProfileSchema);

export default BudgetProfile;
