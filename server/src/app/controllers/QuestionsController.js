const mongoose = require("mongoose");

const questionSchema = require("../models/Question");
const userSchema = require("../models/User");

class QuestionsController {
  //[GET] /questions/new
  questionSortNew(req, res) {
    questionSchema
      .find({}, "_id upvote downvote viewed title tags solved createdAt")
      .populate("user", { username: 1, avatar: 1, reputationScore: 1, _id: 1 })
      .limit(req.query.limit)
      .sort({ createdAt: req.query.sort })
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

  //[GET] /questions/vote
  questionSortVote(req, res) {
    questionSchema
      .find({}, "_id upvote downvote viewed title tags solved createdAt")
      .populate("user", { username: 1, avatar: 1, reputationScore: 1, _id: 1 })
      .limit(req.query.limit)
      .sort({ upvote: req.query.sort })
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
        "_id upvote downvote viewed title tags solved createdAt"
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

  //[GET] /questions/search
  async questionSearch(req, res) {
    const query = req.query.value;
    // const tags = req.query.tags ? req.query.tags : [];

    console.log(tags);

    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { problem: { $regex: query, $options: "i" } },
        { expecting: { $regex: query, $options: "i" } },
      ],
    };

    // if (tags.length > 0) {
    //   searchQuery.tags = { $in: tags };
    // }

    try {
      const questions = await questionSchema
        .find(searchQuery, "title upvote downvote tags createAt viewed")
        .limit(req.query.limit)
        .populate("user", "username avatar reputationScore");
      res.status(201).send(questions);
    } catch (err) {
      console.log(err);
    }
  }

  //[GET] /questions/tags
  async getAllTags(req, res) {
    // try {
    //   const posts = await questionSchema.find();
    //   const tags = [
    //     ...new Set(posts.flatMap((post) => JSON.parse(post.tags))),
    //   ].map((tag) => String(tag));
    //   res.status(200).json({ tags });
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    // }

    try {
      const posts = await questionSchema.find();
      const tagCounts = {};
      posts.forEach((post) => {
        JSON.parse(post.tags).forEach((tag) => {
          const tagString = String(tag);
          tagCounts[tagString] = (tagCounts[tagString] || 0) + 1;
        });
      });
      const tags = Object.keys(tagCounts).map((tag) => ({
        name: tag,
        count: tagCounts[tag],
      }));
      res.status(200).json({ tags });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new QuestionsController();
