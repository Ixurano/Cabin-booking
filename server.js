require('dotenv').config() // läser in .env-filen

//Express 
const express = require('express')
const app = express()

//cors error fixing
const cors = require("cors")
app.use(cors())

//Mongoose connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to DB'))

//så API använder json
app.use(express.json())


// Routes
app.use('/booking', require('./routes/booking'))
app.use('/cabins', require('./routes/cabins'))
app.use('/users', require("./routes/users"))
app.use('/auth', require("./routes/auth"))

// verification middleware test
app.get('/coffee', require("./middleware/authorize"), (req, res) => {
  res.status(418).send("the server refuses to brew coffee because it is, permanently, a teapot")
})

app.get('/version', (req, res) => {
  res.status(200).send("Version: 3")
})

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
