const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

exports.signUp = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    // console.log(`First name: ${firstName}`);    
    // console.log(`Last name: ${lastName}`);    
    // console.log(`E-mail: ${email}`);    
    // console.log(`password: ${password}`); 

    // Check if email exists in DB.
    const emailExists = await User.findOne({ email: email })
    if (emailExists) {
        console.log('Email already exists.');
        res.status(401).send({ error: 'Email already exists.' })
    }

    // Hash the password.
    const hashPassword = await bcrypt.hash(password, 8);

    const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashPassword
    })

    try {
        const saveUser = await user.save()
        console.log('Signed up successfully.');
        res.status(200).send({ success: 'Signed up successfully.' })
    } catch (error) {
        console.log('Something went wrong.');
        res.status(401).send({ error: 'Something went wrong.' })
    }

}