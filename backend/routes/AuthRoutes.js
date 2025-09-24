const express = require('express')
const router = express.Router()
const authRoutes = require('../controllers/AuthController')

router.post('/login', authRoutes.login)
router.get('/refresh', authRoutes.refresh)
router.post('/logout', authRoutes.logout)

module.exports = router