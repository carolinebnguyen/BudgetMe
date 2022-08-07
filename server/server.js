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

app.get('/api', (req, res) => {
    res.json({ message: 'Hello from Mochi!' });
});

// Return React web app
/* app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
}); */

// Init Middlewares
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/budget-profile', budgetProfileRoute);

// Start Express Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
