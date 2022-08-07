import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExpenseCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    percentage: {
        type: Number,
        default: 0,
    },
});

export default ExpenseCategorySchema;
