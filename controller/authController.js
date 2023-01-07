const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validate } = require("../model/User");
const Joi = require("joi");

exports.signUp = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    try {
        // Validate user's input data
        const { error } = validate(req.body);
        if (error) {
            console.log("❌ Error in signup, req.body validation - " + error.details[0].message);
            return res.status(400).send({ message: error.details[0].message })
        }

        // Check if email exists in DB.
        const emailExists = await User.findOne({ email: email })
        if (emailExists) {
            console.log('❌ Email already exists.');
            return res.status(409).json({ message: '❌ Email already exists.' })
        } else {
            // Hash the password.
            const hashPassword = await bcrypt.hash(password, 8);

            const user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashPassword
            })

            await user.save()
            console.log('✅ Signed up successfully.');
            res.status(201).send({ success: '✅ Signed up successfully.' })

        }
    } catch (error) {
        res.status(500).send({ message: "❌ Internal server error." })
    }
}

const validateSignIn = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    })
    return schema.validate(data);
}

exports.signIn = async (req, res) => {
    try {
        // Validate user's input data
        const { error } = validateSignIn(req.body);
        if (error) {
            console.log("Error in sign in validation - ❌" + error.details[0].message);
            return res.status(400).send({ message: error.details[0].message })
        }

        // Check if e-mail exists in DB.
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            console.log('❌ You are not registered.');
            return res.status(401).send({ message: '❌ You are not registered.' })
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            console.log('❌ Incorrect email or password.');
            return res.status(401).send({ message: '❌ Incorrect email or password.' })
        }

        const token = user.generateAuthToken();
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        // validTokens.push(token);

        // Set the JWT token in an HTTP-only cookie
        // const maxAge = 3 * 24 * 60 * 60;
        // res.cookie('jwt', token, { httpOnly: true });

        console.log("✅ Logged in successfully.");
        console.log("🔑 " + token + " 🔑");
        res.status(200).send({ token: token, success: '✅ Logged in successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "❌ Internal server error." })
    }
}


