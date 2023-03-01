const express = require("express");
const router = express.Router();

const UserController = require("../app/controllers/UserController");

//[GET] /user
router.get("/", UserController.index);
//[POST] /user/check (check)
router.post("/check", UserController.check);
//[POST] /user
router.post("/", UserController.create);

module.exports = router;
