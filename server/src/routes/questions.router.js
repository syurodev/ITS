const express = require("express");
const router = express.Router();

const questionsController = require("../app/controllers/QuestionsController");

//[GET] /questions/question
router.get("/question/", questionsController.question);

//[GET] /questions
router.get("/", questionsController.index);

//[PATCH] /questions/upvote:item
router.patch("/upvote/:item", questionsController.updateUpvote);

//[PATCH] /questions/downvote:item
router.patch("/downvote/:item", questionsController.updateDownvote);

//[PATCH] /questions/unvote:item
router.patch("/unvote/:item", questionsController.updateUnvote);

//[POST] /questions/ask
router.post("/ask", questionsController.upload);

module.exports = router;
