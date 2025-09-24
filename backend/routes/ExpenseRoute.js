const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const ExpenseController = require('../controllers/ExpenseController')

router.use(verifyJWT)

router.route('/')
.get(ExpenseController.getExpenses)
.post(ExpenseController.createExpense)
.patch(ExpenseController.updateExpense)
.delete(ExpenseController.deleteExpense)

module.exports = router