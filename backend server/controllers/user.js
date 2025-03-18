//[SECTION] Dependencies and Modules
const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require("../auth.js"); //auth is added
const { errorHandler } = auth;


 // Register a new user
exports.registerUser = async (req, res) => {

    const { userName, email, password} = req.body;

    // Validation checks
    if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email format" });
    } else if (password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters long" });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ error: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create new user
        const newUser = new User({
            userName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).send({ message: "Registered successfully" });

    } catch (err) {
        console.error("Error in registration:", err);
        return res.status(500).send({ error: "Server error, please try again later" });
    }
};


// Login user
exports.loginUser = async (req, res) => {

     if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {


            if(result == null){
                return res.status(404).send({ error: "No Email Found" });
            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {

                    return res.status(200).send({ access : auth.createAccessToken(result)})

                } else {

                    return res.status(401).send({ message: "Email and password do not match" });

                }

            }

        })
        .catch(err => err);
    } else {
        return res.status(400).send(false)
    }
}

module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
    .then(user => {
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.password = undefined;

        return res.status(200).send({ user });
    })
    .catch(err => {
        console.error("Error in fetching user profile", err)
        return res.status(500).send({ error: 'Failed to fetch user profile' })
    });

};

// Get all users (Admin only)
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Find user by ID, excluding the password field for security
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user
exports.updateUser = async (req, res) => {
    try {
        const { userName, email, isAdmin } = req.body;
        const userId = req.params.id;

        // Check if the email already exists (only if email is being updated)
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userName, email, isAdmin },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password field from response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};