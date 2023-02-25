const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/signup', authController.signUp);

router.post('/signin', authController.signIn);

// router.get('/logout', authController.logout);

// Set the "Allow" header to include POST for "/signup" route
// router.options('/signup', (req, res) => {
//     res.header('Allow', 'GET, POST, OPTIONS');
//     res.send();
// });

// // Set the "Allow" header to include POST for "/signin" route
// router.options('/signin', (req, res) => {
//     res.header('Allow', 'GET, POST, OPTIONS');
//     res.send();
// });

module.exports = router