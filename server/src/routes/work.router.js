const express = require("express");
const router = express.Router();

const WorkController = require("../app/controllers/WorkController");

//[POST] /work
router.post("/create", WorkController.create);

module.exports = router;
