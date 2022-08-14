import express from 'express';
import { check, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { BudgetProfile, Expense } from '#database/mongodb.js';
import jwtAuth from '#middleware/jwtAuth.js';
import { sendBadRequestError } from '#util/errorUtil.js';

const router = express.Router();

// @route GET api/expense/all
// @queryparam monthYear - month-year for monthly budget
// @desc Get all expenses for user, which can be filtered by monthly budget
// @access Private
router.get(
    '/all',
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

// @route GET api/expense/:expenseId
// @desc Get an expense
// @access Private
router.get('/:expenseId', jwtAuth, async (req, res) => {
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

// @route POST api/expense
// @desc Create an expense
// @access Private
router.post(
    '/',
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

// @route PUT api/expense/:expenseId
// @desc Update an expense
// @access Private
router.put(
    '/:expenseId',
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

// @route DELETE api/expense/:expenseId
// @desc Delete an expense
// @access Private
router.delete('/:expenseId', jwtAuth, async (req, res) => {
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
