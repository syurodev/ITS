const mongoose = require("mongoose");

const answerSchema = require("../models/Answer");
const userSchema = require("../models/User");
const questionSchema = require("../models/Question");

class AnswersController {
  async answerSortNew(req, res) {
    await answerSchema
      .find(
        { question_id: mongoose.Types.ObjectId(req.query.id) },
        "answer createdAt downvote question_id upvote _id"
      )
      .limit(req.query.limit)
      .sort({ createdAt: -1 })
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

  async answerSolved(req, res) {
    const id = req.query.id;
    await answerSchema
      .find({ _id: id }, "answer createdAt downvote question_id upvote _id")
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

  async answerSortVote(req, res) {
    await answerSchema
      .find(
        { question_id: mongoose.Types.ObjectId(req.query.id) },
        "answer createdAt downvote question_id solved upvote _id"
      )
      .limit(req.query.limit)
      .sort({ upvote: -1 })
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
    const { question_id, answer, user } = req.body;

    const io = req.app.get("socketio");
    io.emit("newAnswer", { question_id, answer, user });

    const answerData = new answerSchema({
      question_id,
      answer,
      user,
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
          message: "Add answer successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: "Answer not added successfully",
        });
      });
  }

  //[DELETE] /answers/delete
  async deleteAnswer(req, res) {
    try {
      const { id } = req.query;

      const answer = await answerSchema.findById(id);

      if (!answer) {
        return res.status(404).json({ message: "Không tìm thấy câu trả lời" });
      }

      const { question_id } = answer;

      // Kiểm tra xem câu trả lời được xóa có phải là câu trả lời giải quyết câu hỏi hay không
      const question = await questionSchema.findById(question_id);
      if (
        question &&
        question.solved_answer_id &&
        question.solved_answer_id.equals(answer._id)
      ) {
        question.solved = false;
        question.solved_answer_id = undefined;
        await question.save();
      }

      await answer.remove();

      return res.status(200).json({ message: "Xóa câu trả lời thành công" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
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

  //[PATCH] /answers/solved
  async solved(req, res) {
    // Lấy thông tin question và answer cần update
    const question = await questionSchema.findById(req.body.question);
    const answer = await answerSchema.findById(req.body.id);

    const isAnswerSolved = answer.solved;

    if (
      isAnswerSolved &&
      String(question.solved_answer_id) !== String(answer._id)
    ) {
      answer.solved = false;
      await answer.save();
    }

    question.solved = req.body.solved;
    question.solved_answer_id = req.body.solved ? req.body.id : null;
    await question.save();

    const user = await userSchema.findById(req.body.auth);
    const point = req.body.solved ? 10 : -10;
    user.reputationScore += point;
    await user.save();

    res.status(201).send({
      status: true,
    });
  }

  // async solved(req, res) {
  //   const { id, solved, auth, question } = req.body;
  //   console.log("id", id);
  //   console.log("solved", solved);
  //   console.log("auth", auth);
  //   console.log("question", question);
  //   await answerSchema
  //     .findOneAndUpdate(
  //       {
  //         _id: id,
  //       },
  //       {
  //         solved: solved,
  //       },
  //       {
  //         new: true,
  //       }
  //     )
  //     .exec();

  //   if (req.body.solved) {
  //     await userSchema
  //       .findOneAndUpdate(
  //         {
  //           _id: auth,
  //         },
  //         {
  //           $inc: { reputationScore: 10 },
  //         },
  //         {
  //           new: true,
  //         }
  //       )
  //       .exec();
  //   } else {
  //     await userSchema
  //       .findOneAndUpdate(
  //         {
  //           _id: auth,
  //         },
  //         {
  //           $inc: { reputationScore: -10 },
  //         },
  //         {
  //           new: true,
  //         }
  //       )
  //       .exec();
  //   }

  //   await questionSchema
  //     .findOneAndUpdate(
  //       {
  //         _id: question,
  //       },
  //       {
  //         solved: solved,
  //         solved_answer_id: id,
  //       },
  //       {
  //         new: true,
  //       }
  //     )
  //     .exec((err, result) => {
  //       if (err) {
  //         return res.status(400).send({
  //           status: false,
  //           message: "Error unvote answer",
  //         });
  //       } else {
  //         res.status(201).send({
  //           status: true,
  //         });
  //       }
  //     });
  // }
}

module.exports = new AnswersController();
