// [Dependencies and Modules]
const Post = require('../models/Post');

// [POST] Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id; // Extract user ID from token

        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newPost = new Post({
            title,
            content,
            author: userId // Assign user ID from token
        });

        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// [GET] Retrieve all posts
module.exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'firstName lastName');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// [GET] Retrieve only my posts
exports.getMyPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from token

        // Find posts where the author matches the logged-in user
        const userPosts = await Post.find({ author: userId });

        if (userPosts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        res.status(200).json(userPosts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// [GET] Retrieve a single post by ID
module.exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('author', 'firstName lastName');
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// [PUT] Update a post (Only post owner or admin)
module.exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;
        const isAdmin = req.user.isAdmin;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== userId && !isAdmin) return res.status(403).json({ message: "Unauthorized" });

        post.title = title;
        post.content = content;
        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// [DELETE] Delete a post (Only post owner)
module.exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        if (post.author.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// [DELETE] Admin can delete any post
module.exports.adminDeletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        await Post.findByIdAndDelete(id);
        res.status(200).json({ message: "Post deleted successfully by admin" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
