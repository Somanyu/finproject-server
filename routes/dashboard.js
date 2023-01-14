const express = require('express');
const { date } = require('joi');
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
            req.app.locals.user = user
            console.log("✅ User data sent.");
            next();
            // return res.status(200).send({ data: user })
        }
        else {
            return res.status(403).send({ message: "❌ Error in fetching user details." })
        }
    } catch (error) {
        console.log("❌ Error: " + error);
        return res.status(401).send({ message: "❌ Error in JWT token" })
    }
}



router.post('/startmsg', userData, (req, res) => {
    const user = res.app.locals.user;
    const firstName = user.firstName
    const phone = user.phone
    // https://wa.me/4155238886?text=join%20discover-series

    try {

        const accountSID = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const client = require("twilio")(accountSID, authToken)

        // Create a message instance.
        client.messages.create({
            from: 'whatsapp:+14155238886',
            body: `Hello ${firstName} 👋 !
Welcome to our app! We're excited to have you join us and hope you have a great time using our app.

➕ Add your expenses by sending a text *Add Milk 20*`,
            to: `whatsapp:+91${phone}`,
        }).then(message => {
            console.log("✅ Message sent ")
            console.log("📬 Message SID " + message.sid)
            return res.status(200).send({ success: "✅ Message sent" })
        }).catch(error => {
            console.log(`❌ Error in sending - ${error}`);
            return res.status(500).send({ message: `❌ ${error}` })
        })
    } catch (error) {
        console.log("❌ Error: " + error);
        return res.status(401).send({ message: "❌ Error in sending message" })
    }

})

// https://50fb-2405-201-a009-9-8507-f0e7-62ff-9aa2.ngrok.io/dashboard/receive
router.post('/receive', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    console.log(`🧑 From: ${from}`);
    console.log(`📧 Message: ${body}`);

    // Save the value to a variable in the response's context.
    req.app.locals.from = from
    req.app.locals.body = body
})

router.get('/user', userData, (req, res) => {
    const user = res.app.locals.user;
    return res.status(200).send({ data: user })
});

module.exports = router