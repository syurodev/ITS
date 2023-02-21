class QuestionsController {
  //[GET] /questions
  index(req, res) {
    res.send("Questions");
  }
  //[GET] /questions:item
  question(req, res) {
    res.send("Question");
  }
}

module.exports = new QuestionsController();
