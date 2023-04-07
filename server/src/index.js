const cors = require("cors");
const express = require("express");

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
