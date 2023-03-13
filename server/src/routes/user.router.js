const express = require("express");
const router = express.Router();

const UserController = require("../app/controllers/UserController");

//[GET] /login
router.post("/login", UserController.login);

//[POST] /create
router.post("/create", UserController.create);

//[POST] /bookmark
router.post("/bookmark", UserController.bookmark);

//[GET] /bookmark
router.get("/bookmark", UserController.getBookmark);

module.exports = router;
