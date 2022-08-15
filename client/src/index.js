import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './css/index.css';

// Chakra UI
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

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
            <App />
        </Provider>
    </ChakraProvider>
);
