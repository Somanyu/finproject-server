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
    } else {

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
}

// Create JWT for login
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}

exports.signIn = async (req, res) => {
    try {
        // Check if e-mail exists in DB.
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(401).send({ error: 'You are not registered.' })
        }

        // Check if password is correct.
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            res.status(401).send({ error: 'Incorrect password.' })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ jwt: token });
        // const token = createToken(user._id)
        // res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        // res.status(200).send({ success: 'Signed in successfully.' })

    } catch (error) {
        console.log(error);
    }
}