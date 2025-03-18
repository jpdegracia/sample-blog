// [Dependencies and Modules]
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// [POST] Create a new comment on a post
module.exports.createComment = async (req, res) => {
    try {
        const { post, text } = req.body; // Use "post" instead of "postId"
        const userId = req.user.id;

        // Find the post using the correct ID
        const existingPost = await Post.findById(post);
        if (!existingPost) return res.status(404).json({ message: "Post not found" });

        const newComment = new Comment({
            postId: post,  // Ensure this field matches the schema
            userId: userId,
            commentText: text,  // Ensure this matches the schema
        });

        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


// [GET] Retrieve all comments for a specific post
module.exports.getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId }) // ✅ Correct field name
            .populate('userId', 'firstName lastName'); // ✅ Correct field name for user

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// [PUT] Update a comment (Only comment owner)
module.exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.userId.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

        comment.commentText = text; // Fix: Match schema field `commentText`
        await comment.save();
        res.status(200).json({ message: "Comment updated successfully", comment });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// [DELETE] Delete a comment (Only comment owner or admin)
module.exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;

        const comment = await Comment.findById(id);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        if (comment.userId.toString() !== userId && !isAdmin) return res.status(403).json({ message: "Unauthorized" });

        await Comment.findByIdAndDelete(id);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// [POST] Reply to a comment
// module.exports.replyToComment = async (req, res) => {
//     try {
//         const { commentId } = req.params;
//         const { text } = req.body;
//         const userId = req.user.id;

//         const parentComment = await Comment.findById(commentId);
//         if (!parentComment) return res.status(404).json({ message: "Comment not found" });

//         // Add reply as an embedded document (correct schema)
//         parentComment.replies.push({
//             userId: userId,
//             commentText: text,
//             createdAt: new Date()
//         });

//         await parentComment.save();

//         res.status(201).json({ message: "Reply added successfully", replies: parentComment.replies });
//     } catch (error) {
//         res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

// [POST] Reply to a comment
module.exports.replyToComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        const parentComment = await Comment.findById(commentId).populate('replies.userId', 'firstName lastName'); // Populate userId for replies
        if (!parentComment) return res.status(404).json({ message: "Comment not found" });

        // Add reply as an embedded document
        parentComment.replies.push({
            userId: userId,
            commentText: text,
            createdAt: new Date()
        });

        await parentComment.save();

        // Return the populated replies with user data
        const populatedReplies = await Comment.findById(commentId).populate('replies.userId', 'firstName lastName');
        res.status(201).json({ message: "Reply added successfully", replies: populatedReplies.replies });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

