const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    lastName: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    email: {
        type: String,
        required: true,
        min: 10,
        max: 50
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 16
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// Generate JWT Token
userSchema.methods.generateAuthToken = () => {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
        expiresIn: "5d",
    })
    return token;
}

const User = mongoose.model('User', userSchema);

// Validate input data
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First name"),
        lastName: Joi.string().required().label("Last name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}

module.exports = {User, validate};