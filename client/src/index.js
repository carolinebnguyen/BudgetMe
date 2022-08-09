import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import { Box } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<SignUp />} />
                </Route>
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
    </ChakraProvider>
);
