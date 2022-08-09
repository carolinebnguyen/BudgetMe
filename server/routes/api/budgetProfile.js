import express from 'express';
import { check, validationResult } from 'express-validator';
import { BudgetProfile } from '../../database/mongodb.js';
import jwtAuth from '../../middleware/jwtAuth.js';

const router = express.Router();

// @route GET api/budget-profile
// @desc Get budget profile by token
// @access Private
router.get('/', jwtAuth, async (req, res) => {
    try {
        const budgetProfile = await BudgetProfile.findOne({
            userId: req.user.id,
        });
        res.json(budgetProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST api/budget-profile/monthly-budget
// @desc Create monthly budget
// @access Private
router.post(
    '/monthly-budget',
    [
        check('monthYear', 'MonthYear is required').not().isEmpty(),
        check('monthYear', 'MonthYear must be in xx-2xxx format').matches(
            /^(1[0-2]|0[1-9])-(2\d{3})$/
        ),
        check('amount').optional().isFloat({ min: 0 }),
        jwtAuth,
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { monthYear, amount } = req.body;

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            if (
                budgetProfile.monthlyBudgets.some(
                    (b) => b.monthYear === monthYear
                )
            ) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `MonthlyBudget already exists for MonthYear ${monthYear}`,
                        },
                    ],
                });
            }

            budgetProfile.monthlyBudgets.push({
                monthYear: monthYear,
                amount: amount ?? 0,
            });
            await budgetProfile.save();

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route POST api/budget-profile/expense-category
// @desc Create expense category
// @access Private
router.post(
    '/expense-category',
    [
        check('name', 'Category name is required').not().isEmpty(),
        check('percentage', 'Percentage must be an integer between 0 - 100')
            .optional()
            .isInt({ min: 0, max: 100 }),
        check('amount').optional().isFloat({ min: 0 }),
        jwtAuth,
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, percentage } = req.body;

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            if (budgetProfile.expenseCategories.some((c) => c.name === name)) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `The expense category ${name} already exists`,
                        },
                    ],
                });
            }

            budgetProfile.expenseCategories.push({
                name: name,
                percentage: percentage ?? 0,
            });
            await budgetProfile.save();

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

export default router;
