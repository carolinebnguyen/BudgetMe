import React from 'react';
import ReactDOM from 'react-dom/client';

// React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Chakra UI + Pages
import { ChakraProvider } from '@chakra-ui/react';
import Login from './components/auth/Login.js';
import SignUp from './components/auth/SignUp.js';
import Landing from './components/layout/Landing.js';
import { extendTheme, Box } from '@chakra-ui/react';
import './index.css';

// Redux for State
import { Provider } from 'react-redux';
import store from './store.js';

const theme = extendTheme({
    fonts: {
        heading: `Roboto, sans-serif`,
        body: `Roboto, sans-serif`,
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route
                        path="*"
                        element={
                            <Box style={{ padding: '1rem' }}>
                                <p>There's nothing here!</p>
                            </Box>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </Provider>
    </ChakraProvider>
);
