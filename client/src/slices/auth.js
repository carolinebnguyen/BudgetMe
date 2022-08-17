import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    loading: false,
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
        signupStart: (state) => {
            state.loading = true;
        },
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
        loginStart: (state) => {
            state.loading = true;
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
            state.isAuthenticated = true;
            state.user = payload;
        },
        logout: (state) => {
            state.authToken = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

// Actions
export const {
    signupStart,
    signupSuccess,
    signupFailure,
    loginStart,
    loginSuccess,
    loginFailure,
    loadUser,
    logout,
} = authSlice.actions;

// State Selector
export const authSelector = (state) => state.auth;

// State Reducer
export default authSlice.reducer;
