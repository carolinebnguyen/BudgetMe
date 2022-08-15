import express from 'express';
import { check, validationResult } from 'express-validator';
import { User, BudgetProfile } from '#database/mongodb.js';
import bcrypt from 'bcryptjs';
import jwtSign from '#util/jwtSign.js';
import jwtAuth from '#middleware/jwtAuth.js';

const router = express.Router();

// @route GET api/auth/user
// @desc Get user by token
// @access Private
router.get('/user', jwtAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

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

            const authToken = jwtSign(user.id);
            user = user.toObject();
            delete user.password;

            res.json({
                user,
                authToken,
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route POST api/auth/signup
// @desc Register user & get token
// @access Public
router.post(
    '/signup',
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

            const authToken = jwtSign(user.id);
            user = user.toObject();
            delete user.password;

            res.json({
                user,
                authToken,
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

export default router;
