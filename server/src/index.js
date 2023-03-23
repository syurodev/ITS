const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

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

// Log HTTP requests to the console
// app.use(morgan("dev"));

app.use(cookieParser());

const db = require("./config/db");

//Connect DB
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
