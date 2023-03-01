const userSchema = require("../models/User");

class UserController {
  //[GET] /user
  index(req, res) {}

  //[POST] /user/email
  check(req, res) {
    userSchema.find({ email: req.body.email }, function (err, email) {
      if (!err) {
        if (email.length != 0) {
          res.status(201).send({
            status: false,
            message: "Email đã được sử dụng",
          });
        } else {
          userSchema.find(
            { username: req.body.username },
            function (err, username) {
              if (!err) {
                if (username.length != 0) {
                  res.status(201).send({
                    status: false,
                    message: "Username đã được sử dụng",
                  });
                } else {
                  res.status(201).send({
                    status: true,
                    message: "Ready",
                  });
                }
              } else {
                res.status(400).send({ error: "ERROR!!" });
              }
            }
          );
        }
      } else {
        res.status(400).send({ error: "ERROR!!" });
      }
    });
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

    userSchema.find({ email: userData.email }, function (err, user) {
      if (!err) {
        if (user.length != 0) {
          res.status(201).send({
            status: true,
            data: user[0],
          });
        } else {
          userData
            .save()
            .then((doc) => {
              res.status(201).send({
                status: true,
                data: doc,
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
    });
  }
}

module.exports = new UserController();
