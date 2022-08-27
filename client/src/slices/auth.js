import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    initialAuth: true,
    isAuthenticated: false,
    user: null,
    authToken: localStorage.getItem('authToken'),
    hasError: false,
    loading: {
        show: false,
        isFinished: false,
        isError: false,
        msg: '', 
    }
};

// A slice for posts with our three reducers
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signupStart: (state) => {
            state.loading = {
                ...initialState.loading,
                show: true,
                msg: 'Creating an account for you...'
            }
        },
        signupSuccess: (state, { payload }) => {
            state.initialAuth = false;
            state.isAuthenticated = true;
            state.user = payload.user;
            state.authToken = payload.authToken;
            state.loading.isFinished = true;
            state.loading.msg = 'We created an account for you.'
        },
        signupFailure: (state) => {
            state.loading.isFinished = true;
            state.loading.isError = true;
            state.loading.msg = 'Unable to create an account.'
        },
        loginStart: (state) => {
            state.loading = {
                ...initialState.loading,
                show: true,
                msg: 'Logging you in...'
            }
        },
        loginSuccess: (state, { payload }) => {
            state.initialAuth = false;
            state.isAuthenticated = true;
            state.user = payload.user;
            state.authToken = payload.authToken;
            state.loading.isFinished = true;
            state.loading.msg = 'Logged into your account.'
        },
        loginFailure: (state) => {
            state.loading.isFinished = true;
            state.loading.isError = true;
            state.loading.msg = 'Unable to login.'
        },
        loadUser: (state, { payload }) => {
            state.initialAuth = false;
            state.isAuthenticated = true;
            state.user = payload;
            state.loading = initialState.loading;
        },
        logout: (state) => {
            state.initialAuth = false;
            state.authToken = null;
            state.isAuthenticated = false;
            state.user = null;
            state.loading = initialState.loading;
        }
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
    logout
} = authSlice.actions;

// State Selector
export const authSelector = (state) => state.auth;

// State Reducer
export default authSlice.reducer;
