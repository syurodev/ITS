const express = require("express");
const router = express.Router();

const questionsController = require("../app/controllers/QuestionsController");

//[GET] /questions/question
router.get("/question/", questionsController.question);

//[DELETE] /questions/delete/
router.delete("/question/delete/", questionsController.delete);

//[GET] /questions/tags
router.get("/tags", questionsController.getAllTags);

//[GET] /questions/bookmarks
router.get("/bookmarks", questionsController.getAllBookmark);

//[GET] /questions/search
router.get("/search", questionsController.questionSearch);

//[GET] /questions/new
router.get("/", questionsController.getQuestions);

//[PATCH] /questions/upvote:item
router.patch("/upvote/:item", questionsController.updateUpvote);

//[PATCH] /questions/downvote:item
router.patch("/downvote/:item", questionsController.updateDownvote);

//[PATCH] /questions/unvote:item
router.patch("/unvote/:item", questionsController.updateUnvote);

//[PUT] /questions/edit
router.put("/edit", questionsController.edit);

//[POST] /questions/ask
router.post("/ask", questionsController.upload);

module.exports = router;
