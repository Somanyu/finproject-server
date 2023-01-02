const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

dotenv.config({ path: './.env' });

mongoose.set('strictQuery', false);
// MongoDB connection setup
mongoose.connect(process.env.MONGODB_CONNECT,
    { useNewUrlParser: true }, (err) => {
      if (!err) {
        console.log('Connected to MongoDB Atlas (finproject).');
      } else {
        console.log('Error in connecting to MongoDB Atlas: ' + err);
      }
    }
  )

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const messageRouter = require('./routes/message');
app.use('/message', messageRouter);

// app.get('/', (req, res) => {
//     // Access the form value that was saved in the app's context
//     res.status(200).json({ from: app.locals.from, body: app.locals.body })

//     const accountSID = process.env.TWILIO_ACCOUNT_SID
//     const authToken = process.env.TWILIO_AUTH_TOKEN
//     const client = require("twilio")(accountSID, authToken)

//     // Create a message instance
//     client.messages.create({
//         from: 'whatsapp:+14155238886',
//         body: 'Hello there!',
//         to: 'whatsapp:+916370112909',
//     }).then(message => console.log(message.sid))
// })

// app.post('/sender-reply', (req, res) => {
//     console.log(`From: ${req.body.From}`);
//     console.log(`Message: ${req.body.Body}`);

//     // Save the value to a variable in the app's context
//     app.locals.from = req.body.From
//     app.locals.body = req.body.Body
// })

app.listen(process.env.PORT, () => {
    console.log(`App listening on at http://localhost:${process.env.PORT}`);
})