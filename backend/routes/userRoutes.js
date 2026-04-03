const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.get("/", userController.getUsers)
router.get("/:email", userController.findUserByEmail)
router.patch("/", userController.updateUser)
router.delete("/", userController.deleteUser )

module.exports = router