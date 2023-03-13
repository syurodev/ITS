const mongoose = require("mongoose");

const questionSchema = require("../models/Question");

class QuestionsController {
  //[GET] /questions
  index(req, res) {
    questionSchema.find(
      null,
      null,
      { sort: { createdAt: -1 } },
      function (err, questions) {
        if (!err) {
          res.send(questions);
        }
      }
    );
  }

  //[GET] /questions/question
  async question(req, res) {
    //   questionSchema.findOneAndUpdate(
    //     { _id: mongoose.Types.ObjectId(req.query.id) },
    //     {
    //       $inc: { viewed: 1 },
    //     },
    //     {
    //       new: true,
    //     }
    //   );
    questionSchema
      .aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(req.query.id) },
        },
        {
          $lookup: {
            from: "comments",
            let: { question_id: "$_id" },
            pipeline: [
              {
                $match: {
                  question_id: mongoose.Types.ObjectId(req.query.id),
                },
              },
              {
                $project: {
                  _id: 1,
                  question_id: 1,
                  user: 1,
                  comment: 1,
                  createdAt: 1,
                  editAt: 1,
                },
              },
            ],
            as: "comments",
          },
        },
      ])
      .exec()
      .then((questionDetails) => {
        res.status(200).send(questionDetails);
      })
      .catch((e) => {
        console.log("Error: ", e);
        res.status(400).send(error);
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
