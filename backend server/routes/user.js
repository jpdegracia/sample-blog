//[Dependencies and Modules] 
const express = require('express');
const userController = require('../controllers/user.js');
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/details', verify, userController.getProfile);
router.get('/getAllUser', verify, verifyAdmin, userController.getUsers);
router.get('/getUser/:id', verify, userController.getUserById);
router.patch('/update/:id', verify, userController.updateUser);
router.delete('/delete/:id', verify, verifyAdmin, userController.deleteUser);




module.exports = router;