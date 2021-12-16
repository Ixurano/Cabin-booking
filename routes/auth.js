const express = require('express')
const router = express.Router()
const util = require('util')
const User = require("../models/userModel.js")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body //RAW JSON sent in body
    if (!(email && password)) {
      return res.status(400).send("email and password is required")
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      )
      const refreshToken = jwt.sign(
        { user_id: user._id, email },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: "14d",
        }
      )

      res.status(202).json({token: token, refreshToken: refreshToken})

    } else {
      res.status(401).send("Invalid Credentials")
    }
  } catch (err) {
    console.log(err)
  }
})
.post('/refresh', async (req, res) => {
  const token = req.body.refreshToken || req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send("A token is required for authentication")
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY)
    const user = await User.findOne({ _id })

    if(decoded){
      // Create token
      const token = jwt.sign(
        { user_id: decoded._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      )
      const refreshToken = jwt.sign(
        { user_id: decoded._id, email },
        process.env.REFRESH_TOKEN_KEY,
        {
          expiresIn: "14d",
        }
      )
      res.status(202).json({token: token, refreshToken: refreshToken})
    }
    
  } catch (err) {
    return res.status(401).send("Invalid Token : \n" + err)
  }
  return next()
})

module.exports = router
