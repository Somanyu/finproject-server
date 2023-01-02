const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/signup', authController.signUp);

router.get('/signin', (req, res) => {
    res.json({ type: "login", method: "GET", message: "Success" });
})

module.exports = router