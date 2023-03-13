const express = require("express");
const router = express.Router();

const AnswersController = require("../app/controllers/AnswersController");

//[PATCH] /answers/upvote:item
router.patch("/upvote/:item", AnswersController.updateUpvote);

//[PATCH] /answers/downvote:item
router.patch("/downvote/:item", AnswersController.updateDownvote);

//[PATCH] /answers/unvote:item
router.patch("/unvote/:item", AnswersController.updateUnvote);

//[GET] /answers
router.get("/item/", AnswersController.answer);

//[POST] /answers
router.post("/", AnswersController.create);

module.exports = router;
