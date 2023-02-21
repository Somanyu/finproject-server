const express = require('express');
const { date } = require('joi');
const jwt = require('jsonwebtoken');
const { User } = require('../model/User');
const router = express.Router();
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
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
        console.log("🍪 Cookies", req.headers.cookie)
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

✅ Add your expenses by sending a text *Add Milk 20*
💸 See all your expenses by sending *Show*`,
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


const sendReply = (phone, text) => {
    try {

        const accountSID = process.env.TWILIO_ACCOUNT_SID
        const authToken = process.env.TWILIO_AUTH_TOKEN
        const client = require("twilio")(accountSID, authToken)

        // Create a message instance.
        client.messages.create({
            from: 'whatsapp:+14155238886',
            body: `${text}`,
            to: `whatsapp:+91${phone}`,
        }).then(message => {
            console.log("✅ Reply sent ")
            console.log("📬 Message SID " + message.sid)
            // return res.status(200).send({ success: "✅ Message sent" })
        }).catch(error => {
            client.messages.create({
                from: 'whatsapp:+14155238886',
                body: `${text}`,
                to: `whatsapp:+91${phone}`
            })
            console.log(`❌ Error in sending reply - ${error}`);
            // return res.status(500).send({ message: `❌ ${error}` })
        })
    } catch (error) {
        console.log("❌ Error in sending reply: " + error);
        // return res.status(401).send({ message: "❌ Error in sending message" })
    }
}


const addExpenses = (id, product, price) => {
    User.findByIdAndUpdate(id, { $push: { expenses: { product: product, price: price } } }, (err, res) => {
        if (err) {
            return err
        } else {
            let text = `${product} added with ${price}.`
            console.log(`✅ ${product} added`);
            // return text;
        }

    })
}


const showExpenses = async (id) => {
    try {
        const docs = await User.findById(id);
        return docs;
    } catch (err) {
        return err;
    }
}

// https://finproject-server.onrender.com/dashboard/receive
router.post('/receive', (req, res) => {
    const from = req.body.From;
    const body = req.body.Body;

    console.log(`🧑 From: ${from}`);
    console.log(`📧 Message: ${body}`);

    // User details in app.locals context
    const user = res.app.locals.user;
    console.log("🧑 Logged in user: ", user);
    const id = user.id;
    const phone = user.phone;

    const tokenizedText = tokenizer.tokenize(body);
    // let stemmedText = tokenizedText.map(word => stemmer.stem(word));
    if (tokenizedText.includes("Add")) {
        let item = tokenizedText.filter(word => word !== "add");

        // Product name
        let product = item[1].charAt(0).toUpperCase() + item[1].slice(1);
        // Product price
        let price = item[2];

        if (!isNaN(price)) {
            let text = `🎉 Added: *${product}* of Price: *${price}*`
            console.log(`🎉 Added: ${product} of Price: ${price}`);
            addExpenses(id, product, price)
            sendReply(phone, text);
        } else {
            let text = "❌ Price not mentioned"
            sendReply(phone, text);
        }
    } else if (tokenizedText.includes("Show")) {
        async function handleExpenses() {
            const data = await showExpenses(id);

            let dataString = ""
            let totalExpenses = 0
            for (let i = 0; i < data.expenses.length; i++) {
                dataString += `Product - ${data.expenses[i].product}, Price - ${data.expenses[i].price}\n`;
                totalExpenses += data.expenses[i].price
            }
            console.log("📚 Expenses Shown - ", dataString);
            console.log("‼ Total expenses - ", totalExpenses);
            sendReply(phone, dataString);
            sendReply(phone, `💰 Total expenses: *${totalExpenses}*`);
        }
        handleExpenses();

    } else {
        let text = "❌ The sentence does not contain the keyword *'Add'*"
        sendReply(phone, text)
        console.log("❌ The sentence does not contain the keyword 'add'");
    }

    // Save the value to a variable in the response's context.
    req.app.locals.from = from
    req.app.locals.body = body
})

router.get('/user', userData, (req, res) => {
    const user = res.app.locals.user;
    return res.status(200).send({ data: user })
});

module.exports = router