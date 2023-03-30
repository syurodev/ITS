const express = require("express");
const router = express.Router();

const AnswersController = require("../app/controllers/AnswersController");

//[PATCH] /answers/upvote:item
router.patch("/upvote/:item", AnswersController.updateUpvote);

//[PATCH] /answers/downvote:item
router.patch("/downvote/:item", AnswersController.updateDownvote);

//[PATCH] /answers/unvote:item
router.patch("/unvote/:item", AnswersController.updateUnvote);

//[PATCH] /answers/new
router.patch("/solved/", AnswersController.solved);

//[GET] /answers/new
router.get("/new/", AnswersController.answerSortNew);

//[GET] /answers/solved
router.get("/solved/", AnswersController.answerSolved);

//[GET] /answers/vote
router.get("/vote/", AnswersController.answerSortVote);

//[POST] /answers
router.post("/", AnswersController.create);

module.exports = router;
