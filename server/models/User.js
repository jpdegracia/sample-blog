const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique in the database
    },
    password: {
        type: String,
        required: true
    },
    birthdate: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false // Default value set to false
    }
});

// Create a model from schema
const User = mongoose.model('User', userSchema);

module.exports = User;