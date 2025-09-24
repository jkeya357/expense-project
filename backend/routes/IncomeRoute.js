const express = require('express')
const router = express.Router()
const incomeController = require('../controllers/IncomeController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
.get(incomeController.getIncome)
.post(incomeController.createIncome)
.patch(incomeController.updateIncome)
.delete(incomeController.deleteIncome)

module.exports = router