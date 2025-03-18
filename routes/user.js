// [Dependencies and Modules]
const express = require('express');
const userController = require('../controllers/user.js');
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// [POST] Register a new user
router.post('/register', userController.registerUser);

// [POST] Login user and return JWT token
router.post('/login', userController.loginUser);

// [GET] Get logged-in user profile (Protected)
router.get('/profile', verify, userController.getUserProfile);

// [PUT] Update user profile (Protected)
router.put('/profile', verify, userController.updateUserProfile);

// [GET] Search for a user by name or email (Protected)
router.get('/search', verify, userController.searchUser);

// [GET] Get all users (Admin only)
router.get('/all', verify, verifyAdmin, userController.getAllUsers);

// [GET] Get a single user by ID 
router.get('/:id', verify, userController.getUserById);

// [DELETE] Delete any user (Admin only)
router.delete('/:id', verify, verifyAdmin, userController.deleteUserById);

module.exports = router;
