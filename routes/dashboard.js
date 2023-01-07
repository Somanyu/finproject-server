const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../model/User');
const router = express.Router();
// const requireAuth = require('../middleware/authMiddleware');

function verifyJWTToken(token) {
    try {
        // Verify the JWT token and return the decoded token.
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("🔓 Decoded JWT: " + decoded);
            return decoded;
        } else {
            console.log("❌ Token not found.");
            return null;
        }
    } catch (err) {
        // If the token is invalid, return an error
        return err;
    }
}


// router.get('/', (req, res) => {
//     console.log('SIGNED IN SUCCESSFULLY');
//     const token = req.cookies.jwt;
//     const user = validateJWTToken(token);
//     console.log("🧑 User" + user);
// })



router.post('/startmsg', (req, res) => {

    try {
        const token = req.headers.cookie;
        console.log("🔑 KEY: " + token.split("=")[1]);
        const decoded = verifyJWTToken(token);

        if (decoded) {
            const accountSID = process.env.TWILIO_ACCOUNT_SID
            const authToken = process.env.TWILIO_AUTH_TOKEN
            const client = require("twilio")(accountSID, authToken)

            const phone = req.body.phone;

            // Create a message instance.
            client.messages.create({
                from: 'whatsapp:+14155238886',
                body: 'Hello there!',
                to: `whatsapp:+91${phone}`,
            }).then(message => {
                console.log("✅ Message sent ")
                console.log("📬 Message SID " + message.sid)
                return res.status(200).send({ success: "✅ Message sent" })
            }).catch(error => {
                console.log(`❌ Error in sending - ${error}`);
                return res.status(500).send({ message: `❌ ${error}` })
            })
        }
        else {
            console.log("❌ JWT not verified.");
            return res.status(401).send({ message: "❌ JWT not verified." })
        }
    } catch (error) {
        console.log("❌ Error: " + error);
        return res.status(401).send({ message: "❌ Error in JWT token." })
    }

})

router.post('/receive', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    console.log(`🧑 From: ${from}`);
    console.log(`📧 Message: ${body}`);

    // Save the value to a variable in the response's context.
    req.app.locals.from = from
    req.app.locals.body = body
})

router.get('/user', (req, res) => {
    const token = req.headers.cookie;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                return res.locals.user;
            } else {
                let user = await User.findById(decodedToken.id);
                // res.locals.user = user;
                return res.status(200).send({ data: user });
            }
        })
    } else {
        res.locals.user = null;
        return res.locals.user;
    }
})

module.exports = router

// https://af7b-2405-201-a009-43-f160-cd34-392e-953.ngrok.io/dashboard/receive