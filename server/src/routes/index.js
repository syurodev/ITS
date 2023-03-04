const questionsRouter = require("./questions.router");
const userRouter = require("./user.router");

function route(app) {
  app.use("/api/questions", questionsRouter);
  app.use("/api/user", userRouter);
}

module.exports = route;
