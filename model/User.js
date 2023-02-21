const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')

// Define the schema for expenses sub-document
const expenseSchema = new mongoose.Schema({
    product: { type: String },
    price: { type: Number }
})

// Define the schema for User document
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
    avatar: {
        type: String,
        default: function () {
            return `https://api.dicebear.com/5.x/big-smile/svg?seed=${this.firstName}`
        }
    },
    phone: {
        type: String,
        required: true,
        min: 10,
        max: 10
    },
    gender: {
        type: String,
        required: true
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
    expenses: [expenseSchema],
    date: {
        type: Date,
        default: Date.now
    }
})

// Generate JWT Token
// const maxAge = 3 * 24 * 60 * 60;
// userSchema.methods.generateAuthToken = () => {
//     const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
//         expiresIn: maxAge,
//     })
//     return token;
// }

const User = mongoose.model('User', userSchema);

// Validate input data
const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First name"),
        lastName: Joi.string().required().label("Last name"),
        phone: Joi.string().required().label("Phone"),
        gender: Joi.string().required().label("Gender"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}

module.exports = { User, validate };