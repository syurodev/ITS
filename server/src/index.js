const express = require("express");
const route = require("./routes");
const app = express();
const port = 4000;

const db = require("./config/db");

//Connect DB
db.connect();

// Routes
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
