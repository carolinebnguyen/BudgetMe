import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExpenseSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    monthYear: {
        // example: "12-2022"
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    categoryName: {
        type: String,
    },
    date: {
        type: Date,
    },
});

export default ExpenseSchema;
