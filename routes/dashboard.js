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
            console.log("✅ Decoded");
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


const userData = async (req, res, next) => {
    try {
        const token = req.headers.cookie;
        const decoded = verifyJWTToken(token.split("=")[1]);

        if (decoded) {
            let user = await User.findById(decoded.id)

            console.log("✅ User data sent.");
            next();
            return res.status(200).send({ data: user })
        }
        else {
            return res.status(403).send({ message: "❌ Error in fetching user details." })
        }
    } catch (error) {
        console.log("❌ Error: " + error);
        return res.status(401).send({ message: "❌ Error in JWT token" })
    }
}



router.post('/startmsg', (req, res) => {

    try {
        const token = req.headers.cookie;
        const decoded = verifyJWTToken(token.split("=")[1]);

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
        return res.status(401).send({ message: "❌ Error in sending message" })
    }

})

// https://e2a8-2405-201-a009-43-2977-492d-11e0-261c.ngrok.io/dashboard/receive
router.post('/receive', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    console.log(`🧑 From: ${from}`);
    console.log(`📧 Message: ${body}`);

    // Save the value to a variable in the response's context.
    req.app.locals.from = from
    req.app.locals.body = body
})

router.get('/user', userData);

module.exports = router