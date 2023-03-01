const questionsRouter = require("./questions.router");
const userRouter = require("./user.router");

function route(app) {
  app.use("/questions", questionsRouter);
  app.use("/user", userRouter);
}

module.exports = route;
