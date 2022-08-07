import mongoose from 'mongoose';
const { Schema } = mongoose;

const MonthlyBudgetSchema = new Schema({
    monthYear: {
        // example: "12-2022"
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
});

export default MonthlyBudgetSchema;
