const mongoose = require("mongoose");

const questionSchema = require("../models/Question");
const userSchema = require("../models/User");

class QuestionsController {
  //[GET] /questions
  index(req, res) {
    questionSchema
      .find({}, "_id upvote downvote viewed title tags solved createdAt")
      .populate("user", { username: 1, avatar: 1, reputationScore: 1, _id: 1 })
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

  //[GET] /questions/question
  async question(req, res) {
    questionSchema
      .find({ _id: mongoose.Types.ObjectId(req.query.id) })
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

  //[POST] /questions/ask
  async upload(req, res) {
    const questionData = new questionSchema({
      title: req.body.title,
      problem: req.body.problem,
      expecting: req.body.expecting,
      tags: req.body.tags,
      user: req.body.user,
    });

    userSchema
      .findOneAndUpdate(
        {
          _id: req.body.user._id,
        },
        {
          $inc: { reputationScore: 10 },
        },
        {
          new: true,
        }
      )
      .exec();

    await questionData
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
          message: "Error adding question",
        });
      });
  }

  //[PATCH] /questions/upvote:item
  async updateUpvote(req, res) {
    const userUpvote = req.body.user;
    if (req.body.user !== req.body.score) {
      await userSchema
        .findOneAndUpdate(
          {
            _id: req.body.score,
          },
          {
            $inc: { reputationScore: 2 },
          },
          {
            new: true,
          }
        )
        .exec();
    }
    await questionSchema
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
            message: "Error upvote question",
          });
        } else {
          res.status(201).send({
            status: true,
            data: result,
          });
        }
      });
  }

  //[PATCH] /questions/downvote:item
  async updateDownvote(req, res) {
    const userUpvote = req.body.user;
    if (req.body.user !== req.body.score) {
      await userSchema
        .findOneAndUpdate(
          {
            _id: req.body.score,
          },
          {
            $inc: { reputationScore: -2 },
          },
          {
            new: true,
          }
        )
        .exec();
    }

    await questionSchema
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
            message: "Error downvote question",
          });
        } else {
          res.status(201).send({
            status: true,
            data: result,
          });
        }
      });
  }

  //[PATCH] /questions/unvote:item
  async updateUnvote(req, res) {
    const userUpvote = req.body.user;
    if (req.body.user !== req.body.score) {
      await userSchema
        .findOneAndUpdate(
          {
            _id: req.body.score,
          },
          {
            $inc: { reputationScore: -2 },
          },
          {
            new: true,
          }
        )
        .exec();
    }

    await questionSchema
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
            message: "Error unvote question",
          });
        } else {
          res.status(201).send({
            status: true,
            data: result,
          });
        }
      });
  }

  async getAllBookmark(req, res) {
    await questionSchema
      .find(
        {
          _id: { $in: req.body },
        },
        function (err, data) {
          if (!err) {
            res.status(201).send({
              status: true,
              data: data,
            });
          }
        }
      )
      .clone();
  }
}

module.exports = new QuestionsController();
