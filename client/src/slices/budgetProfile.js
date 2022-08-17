import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    loading: false,
    monthlyBudgets: [],
    expenseCategories: [],
    hasError: false,
};

const budgetProfileSlice = createSlice({
    name: 'budgetProfile',
    initialState,
    reducers: {
        getBudgetProfileStart: (state) => {
            state.loading = true;
        },
        getBudgetProfileSuccess: (state, { payload }) => {
            state.loading = false;
            state.monthlyBudgets = payload.monthlyBudgets;
            state.expenseCategories = payload.expenseCategories;
        },
        getBudgetProfileFailure: (state) => {
            state.loading = false;
            state.hasError = true;
        },
        editMonthlyBudgetStart: (state) => {
            state.loading = true;
        },
        editMonthlyBudgetSuccess: (state, { payload }) => {
            state.loading = false;
            state.monthlyBudgets = payload.monthlyBudgets;
        },
        editMonthlyBudgetFailure: (state) => {
            state.loading = false;
            state.hasError = true;
        },
        editExpenseCategoryStart: (state) => {
            state.loading = true;
        },
        editExpenseCategorySuccess: (state, { payload }) => {
            state.loading = false;
            state.expenseCategories = payload.expenseCategories;
        },
        editExpenseCategoryFailure: (state) => {
            state.loading = false;
            state.hasError = true;
        },
    },
});

export const {
    getBudgetProfileStart,
    getBudgetProfileSuccess,
    getBudgetProfileFailure,
    editMonthlyBudgetStart,
    editMonthlyBudgetSuccess,
    editMonthlyBudgetFailure,
    editExpenseCategoryStart,
    editExpenseCategorySuccess,
    editExpenseCategoryFailure,
} = budgetProfileSlice.actions;

export const budgetProfileSelector = (state) => state.budgetProfile;

export default budgetProfileSlice.reducer;
