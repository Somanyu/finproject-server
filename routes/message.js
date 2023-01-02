const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Access the form value that was saved in the response's context.
    res.status(200).json({ from: req.app.locals.from, body: req.app.locals.body })
});

router.get('/send', (req, res) => {

    const accountSID = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require("twilio")(accountSID, authToken)

    // Create a message instance.
    client.messages.create({
        from: 'whatsapp:+14155238886',
        body: 'Hello there!',
        to: 'whatsapp:+916370112909',
    }).then(message => {
        res.status(200).send({status: "Success"})
        console.log(message.sid)
    })

})

// https://fb59-2405-201-a009-aa-ecee-a557-bc14-757e.ngrok.io/message/receive
router.post('/receive', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    console.log(`From: ${from}`);
    console.log(`Message: ${body}`);

    // Save the value to a variable in the response's context.
    req.app.locals.from = from
    req.app.locals.body = body
})

module.exports = router