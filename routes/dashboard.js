const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');

router.get('/', requireAuth,(req, res) => {
    console.log('SIGNED IN SUCCESSFULLY');
})

module.exports = router