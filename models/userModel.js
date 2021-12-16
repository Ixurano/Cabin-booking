//import { Schema, model } from 'mongoose'
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null, required: true },
    last_name: { type: String, default: null, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: null, required: false },
}, { timestamps: true })

module.exports = mongoose.model(
    'User', 
    userSchema
)