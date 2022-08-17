import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    loading: false,
    currentExpense: null,
    monthlyExpenses: [],
    allExpenses: [],
    deleteExpense: false,
    hasError: false,
};

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        getExpenseStart: (state) => {
            state.loading = true;
        },
        getCurrentExpenseSuccess: (state, { payload }) => {
            state.loading = false;
            state.currentExpense = payload;
        },
        getMonthlyExpensesSuccess: (state, { payload }) => {
            state.loading = false;
            state.monthlyExpenses = payload;
        },
        getAllExpensesSuccess: (state, { payload }) => {
            state.loading = false;
            state.allExpenses = payload;
        },
        getExpenseFailure: (state) => {
            state.loading = false;
            state.hasError = true;
        },
        editCurrentExpenseStart: (state) => {
            state.loading = true;
        },
        editCurrentExpenseSuccess: (state, { payload }) => {
            state.loading = false;
            state.currentExpense = payload;
        },
        editCurrentExpenseFailure: (state) => {
            state.loading = false;
            state.hasError = true;
        },
    },
});

export const {
    getExpenseStart,
    getCurrentExpenseSuccess,
    getMonthlyExpensesSuccess,
    getAllExpensesSuccess,
    getExpenseFailure,
    editCurrentExpenseStart,
    editCurrentExpenseSuccess,
    editCurrentExpenseFailure,
} = expenseSlice.actions;

export const expenseSelector = (state) => state.expense;

export default expenseSlice.reducer;
