import 'dotenv/config';
import express from 'express';
import { check, validationResult } from 'express-validator';
import { User, BudgetProfile } from '../../database/mongodb.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route POST api/users/create
// @desc Register user
// @access Public
router.post(
    '/create',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('username', 'Username is required').not().isEmpty(),
        check(
            'password',
            'Please enter a password with at least 8 characters'
        ).isLength({ min: 8 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, username, password } = req.body;

        try {
            let user = await User.findOne({ $or: [{ username }, { email }] });

            if (user) {
                if (user.username === username) {
                    return res.status(400).json({
                        errors: [{ msg: 'Username is already taken' }],
                    });
                } else {
                    return res.status(400).json({
                        errors: [
                            {
                                msg: 'Email is already associated with an account',
                            },
                        ],
                    });
                }
            }

            user = new User({
                name,
                email,
                username,
                password,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

            const budgetProfile = new BudgetProfile({
                userId: user.id,
            });
            await budgetProfile.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            const jwtToken = process.env.JWT_SECRET;

            jwt.sign(payload, jwtToken, { expiresIn: 3600 }, (err, token) => {
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
