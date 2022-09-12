import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    selectedExpense: null,
    monthlyExpenses: [],
    allExpenses: [],
    deleteExpense: false,
    loading: {
        show: false,
        isFinished: false,
        isError: false,
        msg: '', 
    }
};

const expenseSlice = createSlice({
    name: 'expense',
    initialState,
    reducers: {
        getExpenseStart: (state, { payload }) => {
            state.loading.show = false;
        },
        getSelectedExpenseSuccess: (state, { payload }) => {
            state.selectedExpense = payload;
        },
        getMonthlyExpensesSuccess: (state, { payload }) => {
            state.monthlyExpenses = payload;
        },
        getAllExpensesSuccess: (state, { payload }) => {
            state.allExpenses = payload;
        },
        getExpenseFailure: (state, { payload }) => {
            state.loading.show = true;
            state.loading.isFinished = true;
            state.loading.isError = true;
            state.loading.msg = payload.msg;
        },
        editExpenseStart: (state, { payload }) => {
            state.loading = {
                ...initialState.loading,
                show: true,
                msg: payload.msg
            }
        },
        editExpenseSuccess: (state, { payload }) => {
            state.selectedExpense = payload.data;
            state.loading.isFinished = true;
            state.loading.msg = payload.msg;
        },
        editExpenseFailure: (state, { payload }) => {
            state.loading.isFinished = true;
            state.loading.isError = true;
            state.loading.msg = payload.msg;
        },
    },
});

export const {
    getExpenseStart,
    getSelectedExpenseSuccess,
    getMonthlyExpensesSuccess,
    getAllExpensesSuccess,
    getExpenseFailure,
    editExpenseStart,
    editExpenseSuccess,
    editExpenseFailure,
} = expenseSlice.actions;

export const expenseSelector = (state) => state.expense;

export default expenseSlice.reducer;
