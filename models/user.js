const mongoose = require('mongoose');

// User schema
const userSchema = mongoose.Schema({
    name: String,
    email: String
})

// Assign and export the User Schema
exports.User = mongoose.model('User', userSchema);