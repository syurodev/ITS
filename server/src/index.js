const express = require("express");
const route = require("./routes");
const app = express();
const port = 4000;

const db = require("./config/db");

//Connect DB
db.connect();

app.use(express.urlencoded());
app.use(express.json());

// Routes
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
