const mongoose = require("mongoose");

const answerSchema = require("../models/Answer");

class AnswersController {
  async answer(req, res) {
    await answerSchema
      .aggregate([
        {
          $match: {
            question_id: mongoose.Types.ObjectId(req.query.id),
          },
          // },
          // {
          //   $lookup: {
          //     from: "comments",
          //     pipeline: [
          //       {
          //         $match: {
          //           question_id: mongoose.Types.ObjectId(req.query.id),
          //         },
          //       },
          //       {
          //         $project: {
          //           _id: 1,
          //           question_id: 1,
          //           answer_id: 1,
          //           user: 1,
          //           comment: 1,
          //           createdAt: 1,
          //           editAt: 1,
          //         },
          //       },
          //     ],
          //     as: "comments",
          //   },
        },
      ])
      .exec()
      .then((answerDetails) => {
        res.status(200).send(answerDetails);
      })
      .catch((e) => {
        console.log("Error: ", e);
        res.status(400).send(e);
      });
  }

  async create(req, res) {
    const answerData = new answerSchema({
      question_id: req.body.question_id,
      answer: req.body.answer,
      user: req.body.user,
    });
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
