import {
    signupSuccess,
    signupFailure,
    loginSuccess,
    loginFailure,
    loadUser,
    logout,
    errorReset,
} from '../slices/auth.js';
import api from '../util/api.js';

// Async thunk load user action
export const authLoadUser = () => {
    return async (dispatch) => {
        try {
            const response = await api.get('/auth/user');
            dispatch(loadUser(response.data));
        } catch (err) {
            dispatch(logout());
        }
    };
};

// Async thunk login action
export const authLogin = (username, password) => {
    return async (dispatch) => {
        try {
            dispatch(errorReset());
            const response = await api.post('/auth/login', {
                username,
                password,
            });
            dispatch(loginSuccess(response.data));
        } catch (err) {
            dispatch(loginFailure());
        }
    };
};

// Async thunk signup action
export const authSignup = (signupData) => {
    return async (dispatch) => {
        try {
            dispatch(errorReset());
            const response = await api.post('/auth/signup', signupData);
            dispatch(signupSuccess(response.data));
        } catch (err) {
            dispatch(signupFailure());
        }
    };
};

const authActions = { authLoadUser, authLogin, authSignup };

export default authActions;
