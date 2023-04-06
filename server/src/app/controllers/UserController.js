const userSchema = require("../models/User");
const questionSchema = require("../models/Question");

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

  async getUserInfo(req, res) {
    await userSchema
      .find(
        { _id: req.query.id },
        "username avatar email phone role reputationScore bookmark dateCreate"
      )
      .exec(function (error, result) {
        if (error) {
          res.status(400).send({
            status: false,
            message: "Error query question",
          });
        } else {
          res.status(201).send(result);
        }
      });
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

  async getAllUsers(req, res) {
    const { username, page = 1, limit = 10 } = req.query;
    const query = {};

    if (username) {
      query.username = { $regex: username };
    }

    try {
      const count = await userSchema.countDocuments(query);
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const result = await userSchema
        .find(query, "_id username avatar reputationScore")
        .skip(startIndex)
        .limit(limit)
        .exec();

      const data = [];

      for (const userdata of result) {
        const questions = await questionSchema
          .find({ user: userdata._id }, "tags")
          .exec();

        const tagCounts = {};
        questions.forEach((question) => {
          JSON.parse(question.tags).forEach((tag) => {
            const tagString = String(tag);
            tagCounts[tagString] = (tagCounts[tagString] || 0) + 1;
          });
        });
        let tags = Object.keys(tagCounts)
          .map((tag) => ({
            name: tag,
            count: tagCounts[tag],
          }))
          .sort((a, b) => b.count - a.count);
        tags = tags.slice(0, 3);

        data.push({
          _id: userdata._id,
          username: userdata.username,
          avatar: userdata.avatar,
          reputationScore: userdata.reputationScore,
          tags: tags,
        });
      }

      const pagination = {
        total: count,
        pages: Math.ceil(count / limit),
      };

      if (endIndex < count) {
        pagination.next = {
          page: page + 1,
          limit: limit,
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit: limit,
        };
      }

      res.json({ data, pagination });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error retrieving data" });
    }
  }

  async profile(req, res) {
    const id = req.query.id;
    await userSchema
      .findById(
        id,
        "username avatar dateCreate email phone reputationScore role job"
      )
      .exec((err, user) => {
        if (err) {
          res.status(500).json({ error: "Error retrieving user" });
        } else {
          questionSchema
            .find(
              { user: id },
              "_id title tags upvote downvote viewed createdAt"
            )
            .limit(10)
            .exec((err, questions) => {
              if (err) {
                res.status(500).json({ error: "Error retrieving questions" });
              } else {
                const tagCounts = {};

                questions.forEach((question) => {
                  JSON.parse(question.tags).forEach((tag) => {
                    const tagString = String(tag);
                    tagCounts[tagString] = (tagCounts[tagString] || 0) + 1;
                  });
                });
                let tags = Object.keys(tagCounts)
                  .map((tag) => ({
                    name: tag,
                    count: tagCounts[tag],
                  }))
                  .sort((a, b) => b.count - a.count);
                tags = tags.slice(0, 5);
                const userData = {
                  user: user,
                  questions: questions,
                  tags: tags,
                };
                res.json(userData);
              }
            });
        }
      });
  }

  async changeAvatar(req, res, next) {
    try {
      const base64EncodedAvatar = req.body.avatar;
      const userId = req.body.userId;

      if (!base64EncodedAvatar) {
        throw new Error("Please provide a base64 encoded avatar");
      }

      const user = await userSchema.findByIdAndUpdate(
        userId,
        { avatar: base64EncodedAvatar },
        { new: true }
      );

      res
        .status(201)
        .json({ status: true, message: "Change avatar successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to change avatar" });
    }
  }

  async changeUserInfo(req, res) {
    const { id, username, job, phone, email } = req.body;

    const existingUser = await userSchema.findOne({ username });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.send({ status: false, message: "Username already exists" });
    }

    const existingPhone = await userSchema.findOne({ phone });
    if (phone.trim() !== "") {
      if (existingPhone && existingPhone._id.toString() !== id) {
        return res.send({
          status: false,
          message: "Phone number already exists",
        });
      }
    }

    if (email.trim() !== "") {
      const existingEmail = await userSchema.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== id) {
        return res.send({
          status: false,
          message: "Email address already exists",
        });
      }
    }

    try {
      const updatedUser = await userSchema.findByIdAndUpdate(
        id,
        {
          username,
          job,
          phone,
          email,
        },
        { new: true }
      );
      res.status(200).send({ status: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();
