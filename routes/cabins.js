const express = require('express')
const router = express.Router()
const Cabin = require('../models/cabinModel')
const authorize = require('../middleware/authorize')


//middleware för specifik booking
const getCabinById = async (req, res, next) => {
    const cabin = await Cabin.findOne({ _id: req.params.id }).exec()
    if (!cabin) return res.status(404).send({ message: 'cabin not found' })
    req.cabin = cabin
    next()
}
//post för cabins
router.post('/', authorize, async (req, res) => {
    try {
        const cabin = new Cabin({
            userId: req.user.user_id,
            adress: req.body.adress, // Adress
            size: req.body.size, // Storlek
            sauna: req.body.sauna, // bastu
            beach: req.body.beach, //strand
            price: req.body.price
        })
        const newCabin = await cabin.save()
        res.status(201).send(newCabin)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

})
//Put för cabins
router.patch('/:id', authorize, getCabinById, async (req, res) => {

    const userCheck = await Cabin.findOne({ _id: req.params.id })
    try {
        if (userCheck.userId == req.user.user_id) {
            const updateCabin = await Cabin.updateOne(req.body)
            res.json({ message: "Cabin updated!", modified: updateCabin.modifiedCount })
        }else {
            res.status(401).send("Cabin was not edited. Not the owner of this cabin")
        }
    }
    catch (error) {
        res.status(500).send({ message: error.message })

    }
})

// GET alla posts
router.get('/', async (req, res) => {
    try {
        const cabin = await Cabin.find()
        res.send(cabin)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// för att få en lista på de stugor som ägs av den användare som auktoriserats av en viss JWT
router.get('/owned/', authorize, async (req, res) => {
    try {
        const cabins = await Cabin.find({ id: req.user.user_id})
        res.status(200).send(cabins)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// get booking från ID
router.get('/:id',authorize, getCabinById, async (req, res) => {
    try {

        res.send(req.cabin)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

// Delete booking från ID
router.delete('/:id', authorize, async (req, res) => {
    const userCheck = await Booking.findOne({ _id: req.params.id })
    if (userCheck.userId == req.user.user_id) {
        try {

            await Cabin.deleteOne({ _id: req.params.id }).exec()
            res.send({ message: "Cabin deleted!" })

        } catch (error) {
            res.status(500).send(error.message)
        }
    } else {
        res.status(401).send("Cabin not deleted. Not the owner of this cabin")
    }
})



module.exports = router