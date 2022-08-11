import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from './routes/api/auth.js';
import userRoute from './routes/api/users.js';
import budgetProfileRoute from './routes/api/budgetProfile.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Init Middlewares
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/budget-profile', budgetProfileRoute);

// Return React web app
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.get('*', (req, res) => {
    res.redirect('/');
});
// TODO: Fix redirecting to an existing React Router page e.g. login

// Start Express Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
