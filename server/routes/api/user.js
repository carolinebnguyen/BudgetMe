import 'dotenv/config';
import express from 'express';
import { User } from '#database/mongodb.js';
import jwtAuth from '#middleware/jwtAuth.js';

const router = express.Router();

// @route GET api/user
// @desc Get user by token
// @access Private
router.get('/', jwtAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
