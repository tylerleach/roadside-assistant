const mongoose = require('mongoose');
const User = require('../users/user.model');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expDate: { type: String, required: true },
    CVV: { type: Number, required: true }
});

// Member schema inherits the attributes and options from the User Schema (think inheritance)
const memberSchema = User.discriminator('Member', new Schema({
    membershipType: { type: String, enum: ['Subscription', 'Per-service'], required: true },
    expirationDate: { type: Date, default: null }, // When they're subscription ends (if they are a subscription member)
    creditCard: { type: [cardSchema], select: false } // Credit Card details are not fetched when a query is made unless explicitly stated for security
}));

module.exports = mongoose.model('Member');