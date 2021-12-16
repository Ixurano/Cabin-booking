const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const authorize = require("../middleware/authorize")


router
  // GET USER
  .get('/', authorize, async (req, res) => {
    try {
      const userArr = await User.find()
      const newArr = []

      userArr.forEach(obj => {
        newArr.push({
          first_name: obj.first_name,
          last_name: obj.last_name,
          email: obj.email
        }) 
      });
      res.status(201).send(newArr)

    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

  // ADD USER 
  .post('/', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate if user exist in our database
    const isOldUser = await User.findOne({ email })
    if (isOldUser) {
      return res.status(409).send("User Already Exist. Verify identity at /auth ")
    }

    // check that all fields are filled
    if (firstName && lastName && email && password) {
      encryptedPassword = await bcrypt.hash(password, 10)
      try {
        const user = new User({
          first_name: firstName,
          last_name: lastName,
          email: email.toLowerCase(),
          password: encryptedPassword,
        })
        const userSaved = await user.save()
        res.status(201).send(userSaved)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    } else {
      res.status(400).send("Invalid user creation request. Make sure firstName, lastName, email and password is provided in request")
    }
  })

  // Update user, partially or entierly 
  .patch('/', authorize, async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
      const user = await User.findOne({ email: req.user.email })

      if (firstName) { user.first_name = firstName }
      if (lastName) { user.last_name = lastName }
      if (password) { user.password = await bcrypt.hash(password, 10) }
      if (email) { user.email = email }
      
      user.save()

      res.status(200).send("User updated: " + user)
    } catch (error) {
      res.status(500).send("User not updated: " + error)
    }
  })


  // DELETE USER
  // require verification + email and password to the user to be deleted
  .delete('/', authorize, async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      const user = await User.findOne({ email })
      if (user && (await bcrypt.compare(password, user.password))) {
        try {
          const deletedUser = await User.deleteOne({ email })
          res.status(200).send("User successfully deleted")
        } catch (error) {
          res.status(500).json({ message: error.message })
        }
      } else {
        res.status(400).send("Invalid user delete request. Password or Email wrong")
      }
    } else {
      res.status(400).send("Invalid user delete request. Email missing")
    }
  })


module.exports = router