const express = require("express");
const router = express.Router();

const questionsController = require("../app/controllers/QuestionsController");

//[GET] /questions/:item
router.get("/:item", questionsController.question);
//[GET] /questions
router.get("/", questionsController.index);
//[POST] /questions
router.post("/ask", questionsController.upload);

module.exports = router;
