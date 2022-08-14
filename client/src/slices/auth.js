import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    authenticated: false,
    authToken: '',
};

// A slice for posts with our three reducers
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        isAuthenticated: (state) => {
            state.authenticated = true;
        },
    },
});

// Three actions generated from the slice
export const { isAuthenticated } = authSlice.actions;

// A selector
export const authSelector = (state) => state.auth;

// The reducer
export default authSlice.reducer;

// Asynchronous thunk action
export function fetchAuth() {
    // TBD
}
