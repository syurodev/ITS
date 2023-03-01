const questionSchema = require("../models/Question");

class QuestionsController {
  //[GET] /questions
  index(req, res) {
    res.send({
      title: "this is title",
      body: "this is body",
    });
  }
  //[GET] /questions:item
  question(req, res) {
    res.send("Question");
  }

  //[POST] /questions:item
  async upload(req, res) {
    const questionData = new questionSchema({
      title: req.body.title,
      body: req.body.body,
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
}

module.exports = new QuestionsController();
