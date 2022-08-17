import React, { useEffect } from 'react';
import './css/App.css';

// Pages
import Login from './components/pages/Login.js';
import SignUp from './components/pages/SignUp.js';
import Landing from './components/pages/Landing.js';
import Profile from './components/pages/Profile.js';
import NotFound from './components/pages/NotFound.js';
import Dashboard from './components/pages/Dashboard.js';

// React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Private Route
import PrivateRoute from './components/routing/PrivateRoute.js';

// Redux
import { useDispatch } from 'react-redux';

// Api
import { setAuthToken } from './util/api.js';
import { authLoadUser } from './actions/auth.js';
import { logout } from './slices/auth.js';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Set headers if authToken already exists
        if (localStorage.authToken) {
            setAuthToken(localStorage.authToken);
        }
        dispatch(authLoadUser());

        // Check if user logged in recently in the same session

        // Log user out from all tabs if they log out in one tab
        window.addEventListener('storage', () => {
            if (!localStorage.token) {
                dispatch(logout());
            }
        });
    }, [dispatch]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route element={<PrivateRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
