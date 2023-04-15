const mongoose = require("mongoose");

const workSchema = require("../models/Work");

class WorkController {
  async create(req, res) {
    const { title, position, detail, tags, user, salary } = req.body;
    const workData = new workSchema({
      title,
      position,
      detail,
      tags,
      user,
      salary,
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
}
module.exports = new WorkController();
