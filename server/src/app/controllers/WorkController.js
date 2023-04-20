const mongoose = require("mongoose");
const unidecode = require("unidecode");

const workSchema = require("../models/Work");

class WorkController {
  //[POST] /create
  async create(req, res) {
    const { title, position, tags, user, salary, description, currency } =
      req.body;
    const workData = new workSchema({
      title,
      position,
      description,
      tags,
      user,
      salary,
      currency,
    });

    await workData
      .save()
      .then((doc) => {
        res.status(201).send({
          status: true,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: false,
          message: err,
        });
      });
  }

  //[GET] /works
  async works(req, res) {
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

    const count = await workSchema.countDocuments(query);
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

    await workSchema
      .find(query)
      .populate("user", {
        username: 1,
        avatar: 1,
        address: 1,
        _id: 1,
        company: 1,
        phone: 1,
        email: 1,
      })
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

  //[DELETE] /delete
  async delete(req, res) {
    try {
      const { id } = req.query;
      const result = await workSchema.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Work not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //[PUT] /edit
  async edit(req, res) {
    const { id, title, position, tags, salary, description, currency } =
      req.body;
    const editAt = new Date();

    try {
      await workSchema.findByIdAndUpdate(
        id,
        {
          title,
          position,
          salary,
          description,
          currency,
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
}
module.exports = new WorkController();
