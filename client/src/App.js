import React, { useEffect } from 'react';
import './css/App.css';

// Pages
import Login from './components/pages/Login.js';
import SignUp from './components/pages/SignUp.js';
import Landing from './components/pages/Landing.js';
import Profile from './components/pages/Profile.js';
import NotFound from './components/pages/NotFound.js';
import Dashboard from './components/pages/Dashboard.js';
import ViewExpenses from './components/pages/ViewExpenses.js';
import AddExpense from './components/pages/AddExpense.js';

// React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Private Route
import PrivateRoute from './components/routing/PrivateRoute.js';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { logout, authSelector } from './slices/auth.js';
import { budgetProfileSelector } from './slices/budgetProfile.js';
import { expenseSelector } from './slices/expense.js';
import { authLoadUser } from './actions/auth.js';
import { getBudgetProfile } from './actions/budgetProfile.js';

// Api
import { setAuthToken } from './util/api.js';

// Notifications
import { useLoadingNotification } from './util/loadingNotification.js';

const App = () => {
    const dispatch = useDispatch();
    const loadingNotification = useLoadingNotification();
    const { loading: authLoading } = useSelector(authSelector);
    const { loading: budgetProfileLoading } = useSelector(budgetProfileSelector);
    const { loading: expenseLoading } = useSelector(expenseSelector);

    useEffect(() => {
        // Check if user logged in recently in the same session
        // Set headers if authToken already exists
        if (localStorage.authToken) {
            setAuthToken(localStorage.authToken);
        }
        dispatch(authLoadUser());

        // Log user out from all tabs if they log out in one tab
        window.addEventListener('storage', () => {
            if (!localStorage.token) {
                dispatch(logout());
            }
        });

        dispatch(getBudgetProfile());
    }, [dispatch]);

    useEffect(() => {
        const loading = [
            authLoading, 
            budgetProfileLoading,
            expenseLoading
        ].find(l => l.show);

        if (loading && loading.show) {
            if (!loading.isFinished) {
                loadingNotification.displayLoading(loading.msg);
            }
            else if (!loading.isError) {
                loadingNotification.displaySuccess(loading.msg);
            }
            else {
                loadingNotification.displayError(loading.msg);
            }
        }
    }, [authLoading, budgetProfileLoading, expenseLoading, loadingNotification]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<SignUp />} />
                <Route element={<PrivateRoute />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="view-expenses" element={<ViewExpenses />} />
                    <Route path="add-expense" element={<AddExpense />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
