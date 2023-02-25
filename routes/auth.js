const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

// router.get('/logout', authController.logout);


module.exports = router