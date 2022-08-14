import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoute from '#routes/api/auth.js';
import userRoute from '#routes/api/user.js';
import budgetProfileRoute from '#routes/api/budgetProfile.js';
import expenseRoute from '#routes/api/expense.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Init Middlewares
app.use(express.json({ extended: false }));
app.use(morgan('dev'));

// Define Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/budget-profile', budgetProfileRoute);
app.use('/api/expense', expenseRoute);

// Return React web app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Start Express Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
