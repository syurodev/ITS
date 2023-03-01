const userSchema = require("../models/User");

class UserController {
  //[GET] /login
  login(req, res) {
    userSchema.find(
      { username: req.body.username, password: req.body.password },
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
              },
            });
          }
        } else {
          res.status(400).send({ error: "ERROR!!" });
        }
      }
    );
  }

  //[POST] /user/check
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
    });
  }
}

module.exports = new UserController();
