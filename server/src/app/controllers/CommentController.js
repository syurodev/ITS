const mongoose = require("mongoose");

const commentsSchema = require("../models/Comment");

class CommentController {
  async createCommentQuestion(req, res) {
    const commentData = new commentsSchema({
      question_id: req.body.question_id,
      comment: req.body.comment,
      user: req.body.user,
    });
    await commentData
      .save()
      .then((doc) => {
        res.status(201).send({
          status: true,
          data: doc,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: "Comment not added successfully",
        });
      });
  }

  async createCommentAnswer(req, res) {
    const commentData = new commentsSchema({
      answer_id: req.body.answer_id,
      comment: req.body.comment,
      user: req.body.user,
    });
    await commentData
      .save()
      .then((doc) => {
        res.status(201).send({
          status: true,
          data: doc,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: "Comment not added successfully",
        });
      });
  }
}

module.exports = new CommentController();
