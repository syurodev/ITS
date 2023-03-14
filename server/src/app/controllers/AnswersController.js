const mongoose = require("mongoose");

const answerSchema = require("../models/Answer");
const userSchema = require("../models/User");

class AnswersController {
  async answer(req, res) {
    await answerSchema
      .find(
        { question_id: mongoose.Types.ObjectId(req.query.id) },
        "answer createdAt downvote question_id solved upvote _id"
      )
      .populate("user", { username: 1, avatar: 1, reputationScore: 1, _id: 1 })
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

  async create(req, res) {
    const answerData = new answerSchema({
      question_id: req.body.question_id,
      answer: req.body.answer,
      user: req.body.user,
    });
    await userSchema
      .findOneAndUpdate(
        {
          _id: req.body.user,
        },
        {
          $inc: { reputationScore: 5 },
        },
        {
          new: true,
        }
      )
      .exec();
    await answerData
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
          message: "Answer not added successfully",
        });
      });
  }

  //[PATCH] /answers/upvote:item
  async updateUpvote(req, res) {
    const userUpvote = req.body.user;
    if (req.body.user !== req.body.score) {
      await userSchema
        .findOneAndUpdate(
          {
            _id: req.body.score,
          },
          {
            $inc: { reputationScore: 3 },
          },
          {
            new: true,
          }
        )
        .exec();
    }
    await answerSchema
      .findOneAndUpdate(
        {
          _id: req.params.item,
        },
        {
          $push: { upvote: userUpvote },
          $pull: { downvote: userUpvote },
        },
        {
          new: true,
        }
      )
      .exec((err, result) => {
        if (err) {
          return res.status(400).send({
            status: false,
            message: "Error upvote answer",
          });
        } else {
          res.status(201).send({
            status: true,
            data: result,
          });
        }
      });
  }

  //[PATCH] /answers/downvote:item
  async updateDownvote(req, res) {
    const userUpvote = req.body.user;
    if (req.body.user !== req.body.score) {
      await userSchema
        .findOneAndUpdate(
          {
            _id: req.body.score,
          },
          {
            $inc: { reputationScore: -3 },
          },
          {
            new: true,
          }
        )
        .exec();
    }
    await answerSchema
      .findOneAndUpdate(
        {
          _id: req.params.item,
        },
        {
          $pull: { upvote: userUpvote },
          $push: { downvote: userUpvote },
        },
        {
          new: true,
        }
      )
      .exec((err, result) => {
        if (err) {
          return res.status(400).send({
            status: false,
            message: "Error downvote answer",
          });
        } else {
          res.status(201).send({
            status: true,
            data: result,
          });
        }
      });
  }

  //[PATCH] /answers/unvote:item
  async updateUnvote(req, res) {
    const userUpvote = req.body.user;
    if (req.body.user !== req.body.score) {
      await userSchema
        .findOneAndUpdate(
          {
            _id: req.body.score,
          },
          {
            $inc: { reputationScore: -3 },
          },
          {
            new: true,
          }
        )
        .exec();
    }
    await answerSchema
      .findOneAndUpdate(
        {
          _id: req.params.item,
        },
        {
          $pull: { upvote: userUpvote, downvote: userUpvote },
        },
        {
          new: true,
        }
      )
      .exec((err, result) => {
        if (err) {
          return res.status(400).send({
            status: false,
            message: "Error unvote answer",
          });
        } else {
          res.status(201).send({
            status: true,
            data: result,
          });
        }
      });
  }
}

module.exports = new AnswersController();
