import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    monthlyBudgets: [],
    expenseCategories: [],
    selectedMonthlyBudget: null,
    loading: {
        show: false,
        isFinished: false,
        isError: false,
        msg: '', 
    }
};

const withMonthYearString = (monthlyBudgets) => {
    const isArray = Array.isArray(monthlyBudgets);
    if (!isArray) {
        monthlyBudgets = [monthlyBudgets];
    }
    const result = monthlyBudgets.map(m => {
        const dateString = m.monthYear.split('-');
        dateString.splice(1, 0, '1');
        const date = new Date(dateString.join('-'))
        return {...m, monthYearString: date.toLocaleString('default', { month: 'long', year: 'numeric' })}
    })
    return isArray ? result : result[0];
}

const budgetProfileSlice = createSlice({
    name: 'budgetProfile',
    initialState,
    reducers: {
        getBudgetProfileSuccess: (state, { payload }) => {
            state.monthlyBudgets = withMonthYearString(payload.monthlyBudgets)
            state.expenseCategories = payload.expenseCategories;
        },
        getBudgetProfileFailure: (state) => {
            state.loading = {
                show: true,
                isFinished: true,
                isError: true,
                msg: 'Encountered error retrieving your budget profile.'
            }
        },
        editMonthlyBudgetStart: (state, { payload }) => {
            state.loading = {
                ...initialState.loading,
                show: true,
                msg: payload.msg
            }
        },
        editMonthlyBudgetSuccess: (state, { payload }) => {
            state.monthlyBudgets = withMonthYearString(payload.monthlyBudgets)
            state.loading.isFinished = true;
            state.loading.msg = payload.msg;
        },
        editMonthlyBudgetFailure: (state, { payload }) => {
            state.loading.isFinished = true;
            state.loading.isError = true;
            state.loading.msg = payload.msg;
        },
        editExpenseCategoryStart: (state, { payload }) => {
            state.loading = {
                ...initialState.loading,
                show: true,
                msg: payload.msg
            }
        },
        editExpenseCategorySuccess: (state, { payload }) => {
            state.expenseCategories = payload.expenseCategories;
            state.loading.isFinished = true;
            state.loading.msg = payload.msg;
        },
        editExpenseCategoryFailure: (state, { payload }) => {
            state.loading.isFinished = true;
            state.loading.isError = true;
            state.loading.msg = payload.msg;
        },
        setSelectedMonthlyBudget: (state, { payload }) => {
            state.selectedMonthlyBudget = withMonthYearString(payload);
        }
    },
});

export const {
    getBudgetProfileSuccess,
    getBudgetProfileFailure,
    editMonthlyBudgetStart,
    editMonthlyBudgetSuccess,
    editMonthlyBudgetFailure,
    editExpenseCategoryStart,
    editExpenseCategorySuccess,
    editExpenseCategoryFailure,
    setSelectedMonthlyBudget
} = budgetProfileSlice.actions;

export const budgetProfileSelector = (state) => state.budgetProfile;

export default budgetProfileSlice.reducer;
