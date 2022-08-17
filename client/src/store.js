import { configureStore } from '@reduxjs/toolkit';
import { setAuthToken } from './util/api.js';
import authReducer from './slices/auth.js';
import budgetProfileReducer from './slices/budgetProfile.js';
import expenseReducer from './slices/expense.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        budgetProfile: budgetProfileReducer,
        expense: expenseReducer,
    },
});

let currentState = store.getState();
store.subscribe(() => {
    let previousState = currentState;
    currentState = store.getState();
    if (previousState.auth.authToken !== currentState.auth.authToken) {
        setAuthToken(currentState.auth.authToken);
    }
});

export default store;
