import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema({
  expenseName: {
    required: true,
    type: String,
  },
  cost: {
    required: true,
    type: Number,
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
