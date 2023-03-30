const express = require("express");
const router = express.Router();

const UserController = require("../app/controllers/UserController");

//[GET] /profile
router.get("/profile", UserController.profile);

//[GET] /login/info
router.get("/login/info", UserController.getUserInfo);

//[POST] /login
router.post("/login", UserController.login);

//[POST] /create
router.post("/create", UserController.create);

//[POST] /bookmark
router.post("/bookmark", UserController.bookmark);

//[GET] /bookmark
router.get("/bookmark", UserController.getBookmark);

//[POST] /avatar
router.post("/avatar", UserController.changeAvatar);

//[PUT] /avatar
router.put("/info", UserController.changeUserInfo);

module.exports = router;
