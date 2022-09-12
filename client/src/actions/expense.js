import {
    getExpenseStart,
    getSelectedExpenseSuccess,
    getMonthlyExpensesSuccess,
    getAllExpensesSuccess,
    getExpenseFailure,
    editExpenseStart,
    editExpenseSuccess,
    editExpenseFailure,
} from '../slices/expense.js';

import api from '../util/api.js';

// Async thunk getSelectedExpense action
export const getSelectedExpense = (expenseId) => {
    return async (dispatch) => {
        try {
            dispatch(getExpenseStart());
            const response = await api.get(`/expense/${expenseId}`);
            dispatch(getSelectedExpenseSuccess(response.data));
        } catch (err) {
            const errMsg = err.response.data.errors[0].msg;
            dispatch(getExpenseFailure({ msg: `Failed to get expense: ${errMsg}` }));
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
            const errMsg = err.response.data.errors[0].msg;
            dispatch(getExpenseFailure({ msg: `Failed to get mohthly expenses: ${errMsg}` }));
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
            const errMsg = err.response.data.errors[0].msg;
            dispatch(getExpenseFailure({ msg: `Failed to get all expenses: ${errMsg}` }));
        }
    };
};

// Async thunk addExpense action
export const addExpense = (monthYear, categoryName, name, cost, date) => {
    return async (dispatch) => {
        try {
            dispatch(editExpenseStart({ msg: 'Adding expense...' }));
            if (date) {
                date = date.split('-');
                date = date.slice(1, date.length).concat(date.slice(0,1)).join('-');
            }
            const response = await api.post('/expense', {
                monthYear,
                categoryName,
                name,
                cost,
                date
            });
            dispatch(editExpenseSuccess({ data: response.data, msg: 'Successfully added new expense!' }));
        } catch (err) {
            const errMsg = err.response.data.errors[0].msg;
            dispatch(editExpenseFailure({ msg: `Failed to add expense: ${errMsg}` }));
        }
    };
};

// Async thunk editExpense action
export const editExpense = (expenseId, monthYear, categoryName, name, cost, date) => {
    return async (dispatch) => {
        try {
            dispatch(editExpenseStart({ msg: 'Editing expense...' }));
            if (date) {
                date = date.split('-');
                date = date.slice(1, date.length).concat(date.slice(0,1)).join('-');
            }
            const response = await api.put(`/expense/${expenseId}`, {
                monthYear,
                categoryName,
                name,
                cost,
                date
            });
            dispatch(editExpenseSuccess({ data: response.data, msg: 'Successfully edited expense!' }));
        } catch (err) {
            const errMsg = err.response.data.errors[0].msg;
            dispatch(editExpenseFailure({ msg: `Failed to edit expense: ${errMsg}` }));
        }
    };
};

// Async thunk deleteExpense action
export const deleteExpense = (expenseId) => {
    return async (dispatch) => {
        try {
            dispatch(editExpenseStart({ msg: 'Deleting expense...' }));
            await api.delete(`/expense/${expenseId}`);
            dispatch(editExpenseSuccess({ data: null, msg: 'Successfully deleted expense!' }));
        } catch (err) {
            const errMsg = err.response.data.errors[0].msg;
            dispatch(editExpenseFailure({ msg: `Failed to delete expense: ${errMsg}` }));
        }
    };
};
