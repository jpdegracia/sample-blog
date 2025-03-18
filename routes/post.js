// [Dependencies and Modules]
const express = require('express');
const postController = require('../controllers/post.js');
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// [POST] Create a new post (Protected - Only authenticated users)
router.post('/create', verify, postController.createPost);

// [GET] Retrieve all posts (Public)
router.get('/all', postController.getAllPosts);

// [GET] Retrieve all posts by the logged-in user (Protected)
router.get('/my-posts', verify, postController.getMyPosts);

// [GET] Retrieve a single post by ID (Public)
router.get('/:id', postController.getPostById);

// [PUT] Update a post (Protected - Only post owner or admin)
router.put('/update/:id', verify, postController.updatePost);

// [DELETE] Delete a post (Protected - Only post owner)
router.delete('/delete/:id', verify, postController.deletePost);

// [DELETE] Admin can delete any post (Admin only)
router.delete('/admin/delete/:id', verify, verifyAdmin, postController.adminDeletePost);

module.exports = router;
