import express from 'express';
import { check, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BudgetProfile, Expense } from '../../database/mongodb.js';
import jwtAuth from '../../middleware/jwtAuth.js';
import { sendBadRequestError } from '../../utils/errorUtils.js';

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

// @route GET api/budget-profile/expense/all
// @queryparam monthYear - month-year for monthly budget
// @desc Get all expenses for user, which can be filtered by monthly budget
// @access Private
router.get(
    '/expense/all',
    [
        check('monthYear', 'monthYear must be in MM-2YYY format.')
            .optional()
            .matches(/^(1[0-2]|0[1-9])-(2\d{3})$/),
        jwtAuth,
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const monthYear = req.query.monthYear;

            const expenses = await Expense.find({
                userId: req.user.id,
                ...(monthYear && { monthYear: monthYear }),
            });
            res.json(expenses);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route GET api/budget-profile/expense/:expenseId
// @desc Get an expense
// @access Private
router.get('/expense/:expenseId', jwtAuth, async (req, res) => {
    try {
        const expenseId = req.params.expenseId;
        if (!mongoose.isValidObjectId(expenseId)) {
            return sendBadRequestError(res, `expenseId is invalid.`);
        }

        const expense = await Expense.findOne({
            _id: expenseId,
            userId: req.user.id,
        });

        if (!expense) {
            return sendBadRequestError(res, `Expense does not exist.`);
        }

        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST api/budget-profile/expense
// @desc Create an expense
// @access Private
router.post(
    '/expense',
    [
        check('monthYear', 'monthYear is required.').notEmpty(),
        check('monthYear', 'monthYear must be in MM-2YYY format.').matches(
            /^(1[0-2]|0[1-9])-(2\d{3})$/
        ),
        check('name', 'name is required.').notEmpty(),
        check('cost', 'cost is required.').notEmpty(),
        check(
            'cost',
            'cost cannot be negative and can only have up to 2 decimal digits.'
        ).isDecimal({ min: 0, decimal_digits: '0,2' }),
        check('date', 'date is not in valid format MM-DD-YYYY')
            .optional()
            .isDate({ format: 'MM-DD-YYYY' }),
        jwtAuth,
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { monthYear, name, cost, date, categoryName } = req.body;

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            if (
                !budgetProfile.monthlyBudgets.some(
                    (b) => b.monthYear === monthYear
                )
            ) {
                return sendBadRequestError(
                    res,
                    `Monthly budget '${monthYear}' does not exist for user.`
                );
            }

            if (
                categoryName &&
                !budgetProfile.expenseCategories.some(
                    (c) => c.name === categoryName
                )
            ) {
                return sendBadRequestError(
                    res,
                    `Expense category '${categoryName}' does not exist for user.`
                );
            }

            const expense = new Expense({
                userId: req.user.id,
                monthYear,
                name,
                cost,
                categoryName,
                date,
            });
            await expense.save();

            res.json(expense);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route PUT api/budget-profile/expense/:expenseId
// @desc Update an expense
// @access Private
router.put(
    '/expense/:expenseId',
    [
        check('monthYear', 'monthYear is required.').notEmpty(),
        check('monthYear', 'monthYear must be in MM-2YYY format.').matches(
            /^(1[0-2]|0[1-9])-(2\d{3})$/
        ),
        check('name', 'name is required.').notEmpty(),
        check('cost', 'cost is required.').notEmpty(),
        check(
            'cost',
            'cost cannot be negative and can only have up to 2 decimal digits.'
        ).isDecimal({ min: 0, decimal_digits: '0,2' }),
        check('date', 'date is not in valid format MM-DD-YYYY')
            .optional()
            .isDate({ format: 'MM-DD-YYYY' }),
        jwtAuth,
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const expenseId = req.params.expenseId;
            const { monthYear, name, cost, date, categoryName } = req.body;

            if (!mongoose.isValidObjectId(expenseId)) {
                return sendBadRequestError(res, `expenseId is invalid.`);
            }

            const budgetProfile = await BudgetProfile.findOne({
                userId: req.user.id,
            });

            if (
                !budgetProfile.monthlyBudgets.some(
                    (b) => b.monthYear === monthYear
                )
            ) {
                return sendBadRequestError(
                    res,
                    `Monthly budget '${monthYear}' does not exist for user.`
                );
            }

            if (
                categoryName &&
                !budgetProfile.expenseCategories.some(
                    (c) => c.name === categoryName
                )
            ) {
                return sendBadRequestError(
                    res,
                    `Expense category '${categoryName}' does not exist for user.`
                );
            }

            const expense = await Expense.findOne({
                _id: expenseId,
                userId: req.user.id,
            });

            if (!expense) {
                return sendBadRequestError(res, `Expense does not exist.`);
            }

            expense.set({
                monthYear,
                name,
                cost,
                categoryName,
                date,
            });
            await expense.save();

            res.json(expense);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    }
);

// @route DELETE api/budget-profile/expense/:expenseId
// @desc Delete an expense
// @access Private
router.delete('/expense/:expenseId', jwtAuth, async (req, res) => {
    try {
        const expenseId = req.params.expenseId;
        if (!mongoose.isValidObjectId(expenseId)) {
            return sendBadRequestError(res, `expenseId is invalid.`);
        }

        const response = await Expense.deleteOne({
            _id: expenseId,
            userId: req.user.id,
        });

        if (response.deletedCount === 0) {
            return sendBadRequestError(
                res,
                `Expense to delete does not exist.`
            );
        }

        res.sendStatus(204);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;
