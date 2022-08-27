import {
    getBudgetProfileSuccess,
    getBudgetProfileFailure,
    editMonthlyBudgetStart,
    editMonthlyBudgetSuccess,
    editMonthlyBudgetFailure,
    editExpenseCategoryStart,
    editExpenseCategorySuccess,
    editExpenseCategoryFailure,
    setSelectedMonthlyBudget
} from '../slices/budgetProfile.js';

import api from '../util/api.js';

// Async thunk getBudgetProfile action
export const getBudgetProfile = () => {
    return async (dispatch) => {
        try {
            const response = await api.get('/budget-profile');
            dispatch(getBudgetProfileSuccess(response.data));
        } catch (err) {
            dispatch(getBudgetProfileFailure());
        }
    };
};

// Async thunk addMonthlyBudget action
export const addMonthlyBudget = (monthYear, amount) => {
    return async (dispatch) => {
        try {
            dispatch(editMonthlyBudgetStart());
            const response = await api.post('/budget-profile/monthly-budget', {
                monthYear,
                amount,
            });
            dispatch(editMonthlyBudgetSuccess(response.data));
        } catch (err) {
            dispatch(editMonthlyBudgetFailure());
        }
    };
};

// Async thunk updateMonthlyBudget action
export const updateMonthlyBudget = (monthlyBudgetId, monthYear, amount) => {
    return async (dispatch) => {
        try {
            dispatch(editMonthlyBudgetStart({ msg: 'Updating monthly budget...' }));
            const response = await api.put(
                `/budget-profile/monthly-budget/${monthlyBudgetId}`,
                {
                    monthYear,
                    amount,
                }
            );
            dispatch(editMonthlyBudgetSuccess({ ...response.data, msg: 'Updated monthly budget!' }));
            const monthlyBudget = response.data.monthlyBudgets.find(m => m.monthYear === monthYear);
            dispatch(setSelectedMonthlyBudget(monthlyBudget))
        } catch (err) {
            dispatch(editMonthlyBudgetFailure({ msg: 'Failed to update monthly budget.' }));
        }
    };
};

// Async thunk deleteMonthlyBudget action
export const deleteMonthlyBudget = (monthlyBudgetId) => {
    return async (dispatch) => {
        try {
            dispatch(editMonthlyBudgetStart());
            const response = await api.delete(
                `/budget-profile/monthly-budget/${monthlyBudgetId}`
            );
            dispatch(editMonthlyBudgetSuccess(response.data));
        } catch (err) {
            dispatch(editMonthlyBudgetFailure());
        }
    };
};

// Async thunk addExpenseCategory action
export const addExpenseCategory = (name, percentage) => {
    return async (dispatch) => {
        try {
            dispatch(editExpenseCategoryStart());
            const response = await api.post(
                '/budget-profile/expense-category',
                {
                    name,
                    percentage,
                }
            );
            dispatch(editExpenseCategorySuccess(response.data));
        } catch (err) {
            dispatch(editExpenseCategoryFailure());
        }
    };
};

// Async thunk updateExpenseCategory action
export const updateExpenseCategory = (expenseCategoryId, name, percentage) => {
    return async (dispatch) => {
        try {
            dispatch(editExpenseCategoryStart());
            const response = await api.put(
                `/budget-profile/expense-category/${expenseCategoryId}`,
                {
                    name,
                    percentage,
                }
            );
            dispatch(editExpenseCategorySuccess(response.data));
        } catch (err) {
            dispatch(editExpenseCategoryFailure());
        }
    };
};

// Async thunk deleteExpenseCategory action
export const deleteExpenseCategory = (expenseCategoryId) => {
    return async (dispatch) => {
        try {
            dispatch(editExpenseCategoryStart());
            const response = await api.delete(
                `/budget-profile/expense-category/${expenseCategoryId}`
            );
            dispatch(editExpenseCategorySuccess(response.data));
        } catch (err) {
            dispatch(editExpenseCategoryFailure());
        }
    };
};
