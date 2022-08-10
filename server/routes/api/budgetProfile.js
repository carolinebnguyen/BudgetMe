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

// @route PUT api/budget-profile/monthly-budget
// @desc Update monthly budget
// @access Private
router.put(
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

            const monthlyBudget = budgetProfile.monthlyBudgets.find(
                (b) => b.monthYear === monthYear
            );
            if (!monthlyBudget) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `MonthlyBudget does not exist for MonthYear ${monthYear}.`,
                        },
                    ],
                });
            }

            monthlyBudget.amount = amount;
            await budgetProfile.save();

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route DELETE api/budget-profile/monthly-budget
// @desc Delete monthly budget
// @access Private
router.delete(
    '/monthly-budget',
    [
        check('monthYear', 'MonthYear is required').not().isEmpty(),
        check('monthYear', 'MonthYear must be in xx-2xxx format').matches(
            /^(1[0-2]|0[1-9])-(2\d{3})$/
        ),
        jwtAuth,
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { monthYear } = req.body;

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            const monthlyBudget = budgetProfile.monthlyBudgets.find(
                (b) => b.monthYear === monthYear
            );
            if (!monthlyBudget) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `MonthlyBudget does not exist for MonthYear ${monthYear}.`,
                        },
                    ],
                });
            }

            budgetProfile.monthlyBudgets = budgetProfile.monthlyBudgets.filter(
                (b) => b !== monthlyBudget
            );
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
                            msg: `Expense category ${name} already exists`,
                        },
                    ],
                });
            }

            const totalPercentage = budgetProfile.expenseCategories
                .map((c) => c.percentage)
                .concat([percentage])
                .reduce((a, b) => a + b, 0);

            if (totalPercentage > 100) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `Total percentage ${totalPercentage} would be over 100.`,
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

// @route PUT api/budget-profile/expense-category
// @desc Update expense category
// @access Private
router.put(
    '/expense-category',
    [
        check('name', 'Category name is required').not().isEmpty(),
        check('percentage', 'Percentage must be an integer between 0 - 100')
            .optional()
            .isInt({ min: 0, max: 100 }),
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

            const expenseCategory = budgetProfile.expenseCategories.find(
                (c) => c.name === name
            );
            if (!expenseCategory) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `Expense category ${name} does not exist.`,
                        },
                    ],
                });
            }

            expenseCategory.percentage = percentage;
            const totalPercentage = budgetProfile.expenseCategories
                .map((c) => c.percentage)
                .reduce((a, b) => a + b, 0);

            if (totalPercentage > 100) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `Total percentage ${totalPercentage} would be over 100.`,
                        },
                    ],
                });
            }

            await budgetProfile.save();

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route DELETE api/budget-profile/expense-category
// @desc Delete expense category
// @access Private
router.delete(
    '/expense-category',
    [check('name', 'Category name is required').not().isEmpty(), jwtAuth],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name } = req.body;

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            const expenseCategory = budgetProfile.expenseCategories.find(
                (c) => c.name === name
            );
            if (!expenseCategory) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: `Expense category ${name} does not exist.`,
                        },
                    ],
                });
            }

            budgetProfile.expenseCategories =
                budgetProfile.expenseCategories.filter(
                    (c) => c !== expenseCategory
                );

            await budgetProfile.save();

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// TODO: Make Expense APIs
// Can make expenses that don't belong to any category (will be shown on frontend as "Uncategorized")
// Must provide cost to create expense, can't be negative

// @route GET api/budget-profile/expense/all
// @desc Get all expenses from all monthly budgets
// @access Private

// @route GET api/budget-profile/expense/:monthlyBudgetId/:expenseId
// @desc Get one expense
// @access Private

// @route GET api/budget-profile/expense/all
// @desc Get all expenses in a monthly budget
// @access Private

// @route POST api/budget-profile/expense
// @desc Create expense in a monthly budget
// @access Private

// @route PUT api/budget-profile/expense
// @desc Update expense in a monthly budget
// @access Private

// @route DELETE api/budget-profile/expense
// @desc Delete expense in a monthly budget
// @access Private

export default router;
