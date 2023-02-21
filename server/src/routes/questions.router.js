const express = require("express");
const router = express.Router();

const questionsController = require("../app/controllers/QuestionsController");

//[GET] /questions/:item
router.use("/:item", questionsController.question);
//[GET] /questions
router.use("/", questionsController.index);

module.exports = router;
