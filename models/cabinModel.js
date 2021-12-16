const mongoose = require('mongoose')

const cabinSchema = new mongoose.Schema({
    userId: String, // userID
    adress: String,
    size: String,
    sauna: Boolean,
    beach: Boolean,
    price: Number

}, { timestamps: true })

module.exports = mongoose.model(
    'Cabin',
    cabinSchema
)