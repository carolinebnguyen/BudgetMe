import React, { useEffect } from 'react';
import './css/App.css';

// Pages
import Login from './components/auth/Login.js';
import SignUp from './components/auth/SignUp.js';
import Landing from './components/layout/Landing.js';
import Profile from './components/Profile.js';
import NotFound from './components/layout/NotFound.js';
import Dashboard from './components/layout/Dashboard.js';
import Summary from './components/layout/Summary.js';

// React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Redux
import store from './store.js';
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
            dispatch(authLoadUser());
        }

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
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="summary" element={<Summary />} />
                <Route path="profile" element={<Profile />} />

                {/* <Route path="dashboard" element={} /> */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
