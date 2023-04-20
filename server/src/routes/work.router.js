const express = require("express");
const router = express.Router();

const WorkController = require("../app/controllers/WorkController");

//[GET] /works
router.get("/works", WorkController.works);
//[POST] /create
router.post("/create", WorkController.create);
//[DELETE] /delete
router.delete("/delete", WorkController.delete);
//[PUT] /edit
router.put("/edit", WorkController.edit);

module.exports = router;
