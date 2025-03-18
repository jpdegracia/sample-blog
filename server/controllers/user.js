// [Dependencies and Modules]
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require("../auth");


module.exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, birthdate } = req.body;

        // Check if email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            birthdate
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "User registered successfully", user: savedUser });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


//[CONTROLLER] Login a user

//[User authentication] User authentication
module.exports.loginUser = (req, res) => {
    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                return res.status(404).send({message: 'No email found'});
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.status(200).send({ message: 'User logged in successfully', access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send({message: 'Incorrect email or password'});
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    }else{
        return res.status(400).send({message: 'Invalid email format'});
    }
};

// [GET] Get logged-in user profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [PUT] Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { firstName, lastName, birthdate } = req.body;
        const updateData = { firstName, lastName, birthdate };

        const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Profile updated successfully', user });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [GET] Search users (User only)
exports.searchUser = async (req, res) => {
    try {
        const { query } = req.body; // Get search query from request body

        if (!query) {
            return res.status(400).json({ message: "Please provide a search query" });
        }

        // Search for users matching first name, last name, or email
        const users = await User.find({
            $or: [
                { firstName: { $regex: query, $options: "i" } }, // Case insensitive
                { lastName: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select('-password'); // Exclude password for security

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




// [GET] Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [GET] Get a single user by ID (Admin only)
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// [DELETE] Delete any user (Admin only)
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.deleteOne();
        res.json({ message: 'User deleted successfully by admin' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
