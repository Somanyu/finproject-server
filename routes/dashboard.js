const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const requireAuth = require('../middleware/authMiddleware');

// router.get('/', requireAuth, (req, res) => {
//     console.log('SIGNED IN SUCCESSFULLY');
// })

router.post('/startmsg', (req, res) => {

    const accountSID = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require("twilio")(accountSID, authToken)

    const phone = req.body.phone

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

module.exports = router

// https://67d1-2405-201-a009-4a-3c00-ba70-947d-aae9.ngrok.io/dashboard/receive