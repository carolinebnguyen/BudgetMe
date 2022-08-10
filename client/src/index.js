import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import Landing from './components/Landing.js';
import { extendTheme, Box } from '@chakra-ui/react';

const theme = extendTheme({
    fonts: {
        heading: `Roboto, sans-serif`,
        body: `Roboto, sans-serif`,
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider theme={theme}>
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
    </ChakraProvider>
);
