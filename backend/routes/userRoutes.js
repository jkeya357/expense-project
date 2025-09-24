const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const verifyJWT = require('../middleware/verifyJWT')

router.post('/', userController.createUser)

router.use(verifyJWT)

router.route('/')
    .get(userController.getUsers)
    .patch(userController.updateUser)
    .delete(userController.deleteUser )

module.exports = router