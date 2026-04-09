const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/register',authcontroller.RegisterUser)

router.post('/login',authcontroller.LoginUser)

router.get('/logout',authcontroller.logoutUser)

router.get('/get-me',authMiddleware.authUser,authcontroller.getMe)

module.exports = router;