const mongoose = require('mongoose');
const User = require('./User'); // Import the User model

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Links to the Post model
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the User model
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    replies: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            fullName: { type: String }, // Full name stored here
            commentText: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Pre-save middleware to auto-update `updatedAt`
commentSchema.pre('save', async function (next) {
    if (this.isModified('commentText')) {
        this.updatedAt = Date.now();
    }
    next();
});

// Pre-save middleware for replies to auto-fill the fullName
commentSchema.pre('save', async function (next) {
    if (this.isModified('replies') && this.replies.length > 0) {
        // Loop through the replies and populate the fullName before saving
        for (const reply of this.replies) {
            if (reply.userId) {
                try {
                    const user = await User.findById(reply.userId); // Fetch user details
                    if (user) {
                        reply.fullName = `${user.firstName} ${user.lastName}`; // Set full name
                    }
                } catch (err) {
                    return next(err); // Handle error if user not found
                }
            }
        }
    }
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
