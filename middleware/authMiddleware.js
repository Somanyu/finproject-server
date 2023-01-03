const jwt = require('jsonwebtoken');
const User = require('../model/User');

const requireAuth = (req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');

    // Verify JWT exists.
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err) {
                console.log(err.message)
                res.status(401).json({error: 'You need to sign in.'})
            } else {
                console.log(decodedToken);
                // res.json({data: 'This is protected data.'})
                next();
            }
        })
    } else {
        res.status(401).json({error: 'You need to sign in.'})
    }
}

module.exports = requireAuth;