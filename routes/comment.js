// [Dependencies and Modules]
const express = require('express');
const commentController = require('../controllers/comment.js');
const { verify, verifyAdmin } = require("../auth.js");

const router = express.Router();

// [POST] Create a new comment on a post (Protected)
router.post('/create', verify, commentController.createComment);

// [GET] Retrieve all comments for a specific post (Public)
router.get('/post/:postId', commentController.getCommentsByPost);

// [PUT] Update a comment (Protected - Only comment owner)
router.put('/update/:id', verify, commentController.updateComment);

// [DELETE] Delete a comment (Protected - Only comment owner or admin)
router.delete('/delete/:id', verify, commentController.deleteComment);

// [POST] Reply to a comment (Protected)
router.post('/reply/:commentId', verify, commentController.replyToComment);

module.exports = router;
