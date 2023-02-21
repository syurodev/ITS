const questionsRouter = require("./questions.router");

function route(app) {
  app.use("/questions", questionsRouter);
}

module.exports = route;
