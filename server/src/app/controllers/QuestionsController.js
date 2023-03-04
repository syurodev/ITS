const questionSchema = require("../models/Question");

class QuestionsController {
  //[GET] /questions
  index(req, res) {
    questionSchema.find(function (err, questions) {
      if (!err) {
        res.send(questions);
      }
    });
  }
  //[GET] /questions:item
  question(req, res) {
    questionSchema.find({ _id: req.params.item }, function (err, question) {
      if (!err) {
        res.send(question);
      }
    });
  }

  //[POST] /questions:item
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
}

module.exports = new QuestionsController();
