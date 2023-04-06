const cors = require("cors");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const route = require("./routes");

const app = express();
const port = 4000;

//CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const db = require("./config/db");

//Connect DB
db.connect();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
route(app);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("newAnswer", (answerData) => {
    console.log("New answer added: " + answerData);
    io.emit("newAnswer", answerData);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
