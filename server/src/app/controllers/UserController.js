const mongoose = require("mongoose");

const userSchema = require("../models/User");

class UserController {
  //[GET] /login
  login(req, res) {
    userSchema.find(
      {
        $or: [{ username: req.body.username }, { email: req.body.username }],
        password: req.body.password,
      },
      function (err, user) {
        if (!err) {
          if (user.length === 0) {
            res.status(201).send({
              status: false,
              message: "Tài khoản hoặc mật khẩu không đúng",
            });
          } else {
            res.status(201).send({
              status: true,
              data: {
                username: user[0].username,
                avatar: user[0].avatar,
                email: user[0].email,
                phone: user[0].phone,
                role: user[0].role,
                reputationScore: user[0].reputationScore,
                dateCreate: user[0].dateCreate,
                _id: user[0]._id,
                bookmark: user[0].bookmark,
                upvote: user[0].upvote,
                downvote: user[0].downvote,
              },
            });
          }
        } else {
          res.status(400).send({ error: "ERROR!!" });
        }
      }
    );
  }

  //[POST] /user
  async create(req, res) {
    const userData = new userSchema({
      username: req.body.username,
      avatar: req.body.avatar,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      role: req.body.role,
      reputationScore: req.body.reputationScore,
    });

    userSchema.find(
      { $or: [{ username: userData.username }, { email: userData.email }] },
      function (err, user) {
        if (!err) {
          if (user.length != 0) {
            res.status(201).send({
              status: false,
              message: "Username hoặc Email đã được sử dụng",
            });
          } else {
            userData
              .save()
              .then((doc) => {
                res.status(201).send({
                  status: true,
                  data: {
                    username: doc.username,
                    avatar: doc.avatar,
                    email: doc.email,
                    phone: doc.phone,
                    role: doc.role,
                    reputationScore: doc.reputationScore,
                    dateCreate: doc.dateCreate,
                    _id: doc._id,
                  },
                });
              })
              .catch((err) => {
                res.status(400).send({
                  status: false,
                  message: "Error create account",
                });
              });
          }
        } else {
          res.status(400).send({ error: "ERROR!!" });
        }
      }
    );
  }

  async bookmark(req, res) {
    await userSchema
      .find({ _id: req.body.user }, function (err, data) {
        if (!data[0].bookmark.includes(req.body.id)) {
          userSchema
            .findOneAndUpdate(
              {
                _id: req.body.user,
              },
              {
                $push: { bookmark: req.body.id },
              },
              {
                new: true,
              }
            )
            .exec((err, result) => {
              if (err) {
                return res.status(400).send({
                  status: false,
                  message: "Error save to bookmark",
                });
              } else {
                res.status(201).send({
                  status: true,
                  data: result.bookmark,
                });
              }
            });
        } else {
          userSchema
            .findOneAndUpdate(
              {
                _id: req.body.user,
              },
              {
                $pull: { bookmark: req.body.id },
              },
              {
                new: true,
              }
            )
            .exec((err, result) => {
              if (err) {
                return res.status(400).send({
                  status: false,
                  message: "Error save to bookmark",
                });
              } else {
                res.status(201).send({
                  status: true,
                  data: result.bookmark,
                });
              }
            });
        }
      })
      .clone();
  }

  async getBookmark(req, res) {
    await userSchema
      .find({ _id: req.query.user }, function (err, data) {
        if (data.length === 0) {
          return res.status(400).send({
            status: false,
          });
        } else {
          res.status(201).send({
            status: true,
            data: data[0].bookmark,
          });
        }
      })
      .clone();
  }
}

module.exports = new UserController();
