const answersRouter = require("./answers.router");
const questionsRouter = require("./questions.router");
const userRouter = require("./user.router");
const commentRouter = require("./comment.router");
const workRouter = require("./work.router");

function route(app) {
  app.use("/api/comment", commentRouter);
  app.use("/api/answers", answersRouter);
  app.use("/api/questions", questionsRouter);
  app.use("/api/work", workRouter);
  app.use("/api/user", userRouter);
}

module.exports = route;
