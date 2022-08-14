import express from 'express';
import { check, validationResult } from 'express-validator';
import { User } from '#database/mongodb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route POST api/auth/login
// @desc Authenticate user & get token
// @access Public
router.post(
    '/login',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid credentials' }] });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const jwtToken = process.env.JWT_SECRET;

            // Expires in 3 hrs * 60 mins * 60 seconds per min = 10800 seconds
            jwt.sign(payload, jwtToken, { expiresIn: 10800 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

export default router;
