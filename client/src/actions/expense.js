import {
    getExpenseStart,
    getCurrentExpenseSuccess,
    getMonthlyExpensesSuccess,
    getAllExpensesSuccess,
    getExpenseFailure,
    editCurrentExpenseStart,
    editCurrentExpenseSuccess,
    editCurrentExpenseFailure,
} from '../slices/expense.js';

import api from '../util/api.js';

// Async thunk getCurrentExpense action
export const getCurrentExpense = (expenseId) => {
    return async (dispatch) => {
        try {
            dispatch(getExpenseStart());
            const response = await api.get(`/expense/${expenseId}`);
            dispatch(getCurrentExpenseSuccess(response.data));
        } catch (err) {
            dispatch(getExpenseFailure());
        }
    };
};

// Async thunk getMonthlyExpenses action
export const getMonthlyExpenses = (monthYear) => {
    return async (dispatch) => {
        try {
            dispatch(getExpenseStart());
            const response = await api.get(
                `/expense/all?monthYear=${monthYear}`
            );
            dispatch(getMonthlyExpensesSuccess(response.data));
        } catch (err) {
            dispatch(getExpenseFailure());
        }
    };
};

// Async thunk getAllExpenses action
export const getAllExpenses = () => {
    return async (dispatch) => {
        try {
            dispatch(getExpenseStart());
            const response = await api.get('/expense/all');
            dispatch(getAllExpensesSuccess(response.data));
        } catch (err) {
            dispatch(getExpenseFailure());
        }
    };
};

// Async thunk addExpense action
export const addExpense = (monthYear, name, categoryName, cost) => {
    return async (dispatch) => {
        try {
            dispatch(editCurrentExpenseStart());
            const response = await api.post('/expense', {
                monthYear,
                name,
                categoryName,
                cost,
            });
            dispatch(editCurrentExpenseSuccess(response.data));
        } catch (err) {
            dispatch(editCurrentExpenseFailure());
        }
    };
};

// Async thunk editExpense action
export const editExpense = (expenseId, monthYear, name, categoryName, cost) => {
    return async (dispatch) => {
        try {
            dispatch(editCurrentExpenseStart());
            const response = await api.put(`/expense/${expenseId}`, {
                monthYear,
                name,
                categoryName,
                cost,
            });
            dispatch(editCurrentExpenseSuccess(response.data));
        } catch (err) {
            dispatch(editCurrentExpenseFailure());
        }
    };
};

// Async thunk deleteExpense action
export const deleteExpense = (expenseId) => {
    return async (dispatch) => {
        try {
            dispatch(editCurrentExpenseStart());
            await api.delete(`/expense/${expenseId}`);
            dispatch(editCurrentExpenseSuccess(null));
        } catch (err) {
            dispatch(editCurrentExpenseFailure());
        }
    };
};
