import express from 'express';
import { check, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BudgetProfile, Expense } from '#database/mongodb.js';
import jwtAuth from '#middleware/jwtAuth.js';
import { sendBadRequestError } from '#util/errorUtil.js';

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
        check('monthYear', 'monthYear is required.').notEmpty(),
        check('monthYear', 'monthYear must be in MM-2YYY format.').matches(
            /^(1[0-2]|0[1-9])-(2\d{3})$/
        ),
        check(
            'amount',
            'amount cannot be negative and can only have up to 2 decimal digits.'
        )
            .optional()
            .isDecimal({ min: 0, decimal_digits: '0,2' }),
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
                return sendBadRequestError(
                    res,
                    `MonthlyBudget already exists for MonthYear '${monthYear}'.`
                );
            }

            budgetProfile.monthlyBudgets.push({
                monthYear,
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

// @route PUT api/budget-profile/monthly-budget/:monthlyBudgetId
// @desc Update monthly budget
// @access Private
router.put(
    '/monthly-budget/:monthlyBudgetId',
    [
        check('monthYear', 'monthYear is required.').notEmpty(),
        check('monthYear', 'monthYear must be in MM-2YYY format.').matches(
            /^(1[0-2]|0[1-9])-(2\d{3})$/
        ),
        check('amount', 'amount is required.').notEmpty(),
        check(
            'amount',
            'amount cannot be negative and can only have up to 2 decimal digits.'
        ).isDecimal({ min: 0, decimal_digits: '0,2' }),
        jwtAuth,
    ],
    async (req, res) => {
        try {
            const monthlyBudgetId = req.params.monthlyBudgetId;
            if (!mongoose.isValidObjectId(monthlyBudgetId)) {
                return sendBadRequestError(res, `monthlyBudgetId is invalid.`);
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { monthYear, amount } = req.body;

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            const monthlyBudget = budgetProfile.monthlyBudgets.find(
                (b) => b._id.toString() === monthlyBudgetId
            );
            if (!monthlyBudget) {
                return sendBadRequestError(
                    res,
                    `MonthlyBudget does not exist.`
                );
            }

            const oldMonthYear = monthlyBudget.monthYear;
            monthlyBudget.monthYear = monthYear;
            monthlyBudget.amount = amount;
            if (
                budgetProfile.monthlyBudgets.filter(
                    (b) => b.monthYear === monthYear
                ).length > 1
            ) {
                return sendBadRequestError(
                    res,
                    `MonthlyBudget already exists for MonthYear '${monthYear}'.`
                );
            }

            await budgetProfile.save();
            await Expense.updateMany(
                {
                    userId: req.user.id,
                    monthYear: oldMonthYear,
                },
                {
                    $set: {
                        monthYear: monthYear,
                    },
                }
            );

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route DELETE api/budget-profile/monthly-budget/:monthlyBudgetId
// @desc Delete monthly budget
// @access Private
router.delete('/monthly-budget/:monthlyBudgetId', jwtAuth, async (req, res) => {
    try {
        const monthlyBudgetId = req.params.monthlyBudgetId;
        if (!mongoose.isValidObjectId(monthlyBudgetId)) {
            return sendBadRequestError(res, `monthlyBudgetId is invalid.`);
        }

        const budgetProfile = await BudgetProfile.findOne({
            userId: req.user.id,
        });

        const monthlyBudget = budgetProfile.monthlyBudgets.find(
            (b) => b._id.toString() === monthlyBudgetId
        );
        if (!monthlyBudget) {
            return sendBadRequestError(
                res,
                `MonthlyBudget to delete does not exist.`
            );
        }

        budgetProfile.monthlyBudgets = budgetProfile.monthlyBudgets.filter(
            (b) => b !== monthlyBudget
        );
        await budgetProfile.save();

        await Expense.deleteMany({
            userId: req.user.id,
            monthYear: monthlyBudget.monthYear,
        });

        res.json(budgetProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST api/budget-profile/expense-category
// @desc Create expense category
// @access Private
router.post(
    '/expense-category',
    [
        check('name', 'name is required.').notEmpty(),
        check('percentage', 'percentage must be an integer between 0 - 100.')
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
                return sendBadRequestError(
                    res,
                    `Expense category '${name}' already exists.`
                );
            }

            const totalPercentage = budgetProfile.expenseCategories
                .map((c) => c.percentage)
                .concat([percentage])
                .reduce((a, b) => a + b, 0);

            if (totalPercentage > 100) {
                return sendBadRequestError(
                    res,
                    `Total percentage ${totalPercentage} would be over 100.`
                );
            }

            budgetProfile.expenseCategories.push({
                name,
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

// @route PUT api/budget-profile/expense-category/:expenseCategoryId
// @desc Update expense category
// @access Private
router.put(
    '/expense-category/:expenseCategoryId',
    [
        check('name', 'name is required.').notEmpty(),
        check('percentage', 'percentage must be an integer between 0 - 100.')
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

            const expenseCategoryId = req.params.expenseCategoryId;
            if (!mongoose.isValidObjectId(expenseCategoryId)) {
                return sendBadRequestError(
                    res,
                    `expenseCategoryId is invalid.`
                );
            }

            const { name, percentage } = req.body;

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            const expenseCategory = budgetProfile.expenseCategories.find(
                (c) => c._id.toString() === expenseCategoryId
            );
            if (!expenseCategory) {
                return sendBadRequestError(
                    res,
                    `Expense category does not exist.`
                );
            }

            const oldExpenseCategoryName = expenseCategory.name;
            expenseCategory.name = name;
            if (
                budgetProfile.expenseCategories.filter((c) => c.name === name)
                    .length > 1
            ) {
                return sendBadRequestError(
                    res,
                    `Expense category '${name}' already exists.`
                );
            }

            expenseCategory.percentage = percentage;
            const totalPercentage = budgetProfile.expenseCategories
                .map((c) => c.percentage)
                .reduce((a, b) => a + b, 0);

            if (totalPercentage > 100) {
                return sendBadRequestError(
                    res,
                    `Total percentage ${totalPercentage} would be over 100.`
                );
            }

            await budgetProfile.save();
            await Expense.updateMany(
                {
                    userId: req.user.id,
                    categoryName: oldExpenseCategoryName,
                },
                {
                    $set: {
                        categoryName: name,
                    },
                }
            );

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route DELETE api/budget-profile/expense-category/:expenseCategoryId
// @desc Delete expense category
// @access Private
router.delete(
    '/expense-category/:expenseCategoryId',
    jwtAuth,
    async (req, res) => {
        try {
            const expenseCategoryId = req.params.expenseCategoryId;
            if (!mongoose.isValidObjectId(expenseCategoryId)) {
                return sendBadRequestError(
                    res,
                    `expenseCategoryId is invalid.`
                );
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            const expenseCategory = budgetProfile.expenseCategories.find(
                (c) => c._id.toString() === expenseCategoryId
            );
            if (!expenseCategory) {
                return sendBadRequestError(
                    res,
                    `Expense category to delete does not exist.`
                );
            }

            budgetProfile.expenseCategories =
                budgetProfile.expenseCategories.filter(
                    (c) => c !== expenseCategory
                );

            await budgetProfile.save();

            await Expense.updateMany(
                {
                    userId: req.user.id,
                    categoryName: expenseCategory.name,
                },
                {
                    $unset: {
                        categoryName: null,
                    },
                }
            );

            res.json(budgetProfile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

export default router;
