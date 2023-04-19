const express = require("express");
const router = express.Router();

const UserController = require("../app/controllers/UserController");

//[GET] /profile
router.get("/profile", UserController.profile);

//[GET] /login/info
router.get("/login/info", UserController.getUserInfo);

//[POST] /login
router.get("/login", UserController.login);

//[POST] /create
router.post("/create", UserController.create);

//[POST] /bookmark
router.post("/bookmark", UserController.bookmark);

//[GET] /bookmark
router.get("/bookmark", UserController.getBookmark);

//[GET] /all
router.get("/all", UserController.getAllUsers);

//[POST] /avatar
router.post("/avatar", UserController.changeAvatar);

//[PUT] /info
router.put("/info", UserController.changeUserInfo);

//[PUT] /change-password
router.put("/change-password", UserController.changePassword);

module.exports = router;
