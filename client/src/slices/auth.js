import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    loading: true,
    isAuthenticated: false,
    user: null,
    authToken: localStorage.getItem('authToken'),
    hasError: false,
};

// A slice for posts with our three reducers
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signupSuccess: (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = payload.user;
            state.authToken = payload.authToken;
        },
        signupFailure: (state) => {
            state.loading = false;
            state.hasError = true;
        },
        loginSuccess: (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = payload.user;
            state.authToken = payload.authToken;
        },
        loginFailure: (state) => {
            state.loading = false;
            state.hasError = true;
        },
        loadUser: (state, { payload }) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = payload;
        },
        logout: (state) => {
            state.loading = false;
            state.authToken = null;
            state.isAuthenticated = false;
            state.user = null;
        },
        errorReset: (state) => {
            state.hasError = false;
        },
    },
});

// Actions
export const {
    signupSuccess,
    signupFailure,
    loginSuccess,
    loginFailure,
    loadUser,
    logout,
    errorReset,
} = authSlice.actions;

// State Selector
export const authSelector = (state) => state.auth;

// State Reducer
export default authSlice.reducer;
