const express = require("express");
const router = express.Router();

const UserController = require("../app/controllers/UserController");

//[GET] /user
router.post("/login", UserController.login);
//[POST] /user/check (check)
router.post("/check", UserController.check);
//[POST] /user
router.post("/create", UserController.create);

module.exports = router;
