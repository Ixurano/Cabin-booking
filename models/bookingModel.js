const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    cabinId: String, //stugID
    userId: String, // userID
    description: String,
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    booked: Boolean

}, { timestamps: true })

module.exports = mongoose.model(
    'Booking',
    bookingSchema
)