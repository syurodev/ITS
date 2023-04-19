const unidecode = require("unidecode");

const questionSchema = require("../models/Question");

class QuestionsController {
  //[GET] /questions
  async getQuestions(req, res) {
    const { user, tag, limit = 10, sort = "createdAt", page = 1 } = req.query;
    const query = {};

    if (tag) {
      const tagsArray = Array.isArray(tag) ? tag : [tag];
      const regexTagsArray = tagsArray.map(
        (tag) => new RegExp(unidecode(tag), "iu")
      );
      query.tags = { $in: regexTagsArray };
    }

    if (user) {
      query.user = user;
    }

    const count = await questionSchema.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;

    let currentPage = page ? parseInt(page) : 1;
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const sortObj = {};
    if (sort === "createdAt") {
      sortObj.createdAt = -1;
    } else if (sort === "upvote") {
      sortObj.upvote = 1;
    }

    await questionSchema
      .find(
        query,
        "_id upvote downvote viewed title tags solved createdAt solved_answer_id"
      )
      .populate("user", { username: 1, avatar: 1, reputationScore: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .sort(sortObj)
      .exec(function (error, result) {
        if (error) {
          res.status(400).send({
            status: false,
            message: "Error query question",
          });
        } else {
          const response = {
            total: count,
            page,
            totalPages,
            data: result,
          };
          res.status(201).send(response);
        }
      });
  }

  //[GET] /questions/question
  async question(req, res) {
    const questionId = req.query.id;
    await questionSchema
      .findByIdAndUpdate(questionId, { $inc: { viewed: 1 } }, { new: true })
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
    const { title, problem, expecting, tags, user } = req.body;
    const questionData = new questionSchema({
      title,
      problem,
      expecting,
      tags,
      user,
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

  //[PUT] /questions/edit
  async edit(req, res) {
    const { id, title, problem, expecting, tags } = req.body;
    const editAt = new Date();

    try {
      const updatedQuestion = await questionSchema.findByIdAndUpdate(
        id,
        {
          title,
          problem,
          expecting,
          tags,
          editAt,
        },
        { new: true }
      );
      res.status(200).send({ status: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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
    const userDownvote = req.body.user;

    await questionSchema
      .findOneAndUpdate(
        {
          _id: req.params.item,
        },
        {
          $pull: { upvote: userDownvote },
          $push: { downvote: userDownvote },
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
    const userUnvote = req.body.user;

    await questionSchema
      .findOneAndUpdate(
        {
          _id: req.params.item,
        },
        {
          $pull: { upvote: userUnvote, downvote: userUnvote },
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
    const {
      bookmarks,
      tags,
      limit = 10,
      sort = "createdAt",
      page = 1,
    } = req.query;

    const query = { _id: { $in: bookmarks } };

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      const regexTagsArray = tagsArray.map(
        (tag) => new RegExp(unidecode(tag), "iu")
      );
      query.tags = { $in: regexTagsArray };
    }

    const count = await questionSchema.countDocuments(query);
    const totalPages = Math.ceil(count / limit);
    const skip = (page - 1) * limit;

    let currentPage = page ? parseInt(page) : 1;
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const sortObj = {};
    if (sort === "createdAt") {
      sortObj.createdAt = -1;
    } else if (sort === "upvote") {
      sortObj.upvote = 1;
    }

    await questionSchema
      .find(query, "_id upvote downvote viewed title tags solved createdAt")
      .populate("user", { username: 1, avatar: 1, reputationScore: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .sort(sortObj)
      .exec(function (error, result) {
        if (error) {
          res.status(400).send({
            status: false,
            message: "Error query question",
          });
        } else {
          const response = {
            total: count,
            page,
            totalPages,
            data: result,
          };
          res.status(201).send(response);
        }
      });
  }

  //[GET] /questions/search
  async questionSearch(req, res) {
    const query = req.query.value;
    // const tags = req.query.tags ? req.query.tags : [];

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
    const { tag, limit = 20, page = 1 } = req.query;
    const query = {};

    if (tag) {
      query.tags = { $regex: tag };
    }

    try {
      const tagCounts = {};
      const posts = await questionSchema.find().select("tags");

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

      const regex = new RegExp(tag, "i");

      const filteredTags = await tags.filter((tag) => regex.test(tag.name));
      let paginatedTags = filteredTags;
      if (limit !== "all") {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        paginatedTags = filteredTags.slice(startIndex, endIndex);
      }

      const totalPages = Math.ceil(filteredTags.length / limit);

      res.status(200).json({ tags: paginatedTags, totalPages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //[DELETE] /questions/delete/
  async delete(req, res) {
    try {
      const { id } = req.query;
      const result = await questionSchema.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Question not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new QuestionsController();
