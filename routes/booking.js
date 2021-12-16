const express = require('express')
const router = express.Router()
const Booking = require('../models/bookingModel')
const authorize = require('../middleware/authorize')
const { exists } = require('../models/bookingModel')

//middleware för specifik booking
const getBookingById = async (req, res, next) => {
    const booking = await Booking.findOne({ _id: req.params.id }).exec()
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    req.booking = booking
    next()
}

//skapar en booking
router.post('/', authorize, async (req, res) => {
    if (req.body.cabin && req.body.startDate && req.body.endDate){
        try {
            const bookingByCabin = await Booking.find({ cabinId: req.body.cabin })
    
            //returns true if there is no previous booking start or end date within the proposed interval 
            const isAvailable = bookingByCabin.every(timeSlot => {
                const slotStart = timeSlot.startDate;
                const slotEnd = timeSlot.endDate;
                const bookingStart = new Date(req.body.startDate)
                const bookingEnd = new Date(req.body.endDate)
                
                return (! 
                    bookingStart <= slotStart && bookingEnd >= slotStart // if there is a previous booking start date within the proposed interval 
                    ||
                    bookingStart <= slotEnd && bookingEnd >= slotEnd // if there is a previous booking end date within the proposed interval 
                )
            })
    
            if(isAvailable){
                const booking = new Booking({
                    cabinId: req.body.cabin,
                    userId: req.user.user_id,
                    description: req.body.description,
                    startDate: new Date(req.body.startDate),
                    endDate: new Date(req.body.endDate),
                    booked: req.body.booked
                })
        
                const newBooking = await booking.save()
                res.status(201).send(newBooking)
    
            } else {
                res.status(500).send("Booking failed. Unavailable time-slot")
            }
        } catch (error) {
            console.log("Booking [POST] internal server error: " + error)
            res.status(500).send()
        }
    } else {
        res.status(400).send("Cabin, startDate or endDate for the booking is missing from the request")
    }
   
})

// PUT för att ändra en boknings modify
router.patch('/:id', authorize, getBookingById, async (req, res) => {

    try {
        const userCheck = await Booking.findOne({ _id: req.params.id })
        if (userCheck.userId == req.user.user_id) {
            // objekt för att få formatering korrekt för updatebooking med datumen
            const modifiedCabin = {
                description: req.body.description,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                booked: req.body.booked
            }

            const updateBooking = await Booking.updateOne(modifiedCabin)
            res.json({ message: "Booking updated!", modified: updateBooking.modifiedCount })
        } else {
            res.status(401).send("Booking was not edited. Not the creator of this booking")

        }
    } catch (error) {
        console.log("Booking [PATCH] internal server error: " + error)
        res.status(500).send()
    }

})
// GET alla posts
router.get('/', async (req, res) => {
    try {
        const booking = await Booking.find()
        res.send(booking)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// get booking från ID
router.get('/:id', authorize, getBookingById, async (req, res) => {
    try {

        res.send(req.booking)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Delete booking från ID
router.delete('/:id', authorize, async (req, res) => {
    try {
        const userCheck = await Booking.findOne({ _id: req.params.id })
        if (userCheck.userId == req.user.user_id) {

            await Booking.deleteOne({ _id: req.params.id }).exec()
            res.json({ message: "Booking deleted!" })
        } else {
            res.status(401).send(`Booking was not deleted. 
                Not the creator of this booking`)
        }

    } catch (error) {
        res.status(500).send("user does not exist: " + error.message)
    }

})

module.exports = router