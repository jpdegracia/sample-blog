const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'userName is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required']

    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);
