const mongoose = require('mongoose');
const User = require('../users/user.model');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    username: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String },
    timeStamp: { type: Date, required: true, default: Date.now }
});

// Professional schema inherits the attributes and options from the User Schema (think inheritance)
const professionalSchema = User.discriminator('Professional', new Schema({
    bsb: { type: String, required: false, select: false }, // Bank details by default won't be returned by queries
    accountNumber: { type: Number, required: false, select: false }, // Bank details by default won't be returned by queries
    reviews: [reviewSchema]
}));

module.exports = mongoose.model('Professional');