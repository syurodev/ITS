const mongoose = require("mongoose");

const commentsSchema = require("../models/Comment");
const userSchema = require("../models/User");

class CommentController {
  async getComment(req, res) {
    await commentsSchema
      .find({ question_id: req.query.id })
      .populate("user", { username: 1, reputationScore: 1, _id: 1 })
      .sort({ createdAt: -1 })
      .exec(function (error, result) {
        if (error) {
          res.status(400).send({
            status: false,
            message: "Error query question",
          });
        } else {
          res.status(201).send(result);
        }
      });
  }

  async createCommentQuestion(req, res) {
    const commentData = new commentsSchema({
      question_id: req.body.question_id,
      comment: req.body.comment,
      user: req.body.user,
    });
    await userSchema
      .findOneAndUpdate(
        {
          _id: req.body.user,
        },
        {
          $inc: { reputationScore: 2 },
        },
        {
          new: true,
        }
      )
      .exec();
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
