const express = require("express");
const router = express.Router();

const CommentController = require("../app/controllers/CommentController");

//[POST] /comment/
router.get("/", CommentController.getComment);

//[POST] /comment/question
router.post("/question", CommentController.createCommentQuestion);

//[POST] /comment/answer
router.post("/answer", CommentController.createCommentAnswer);

module.exports = router;
