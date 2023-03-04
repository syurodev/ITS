const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  questionid: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  problem: { type: String },
  expecting: { type: String },
  tags: { type: Array },
  upvote: { type: Number, default: 0 },
  downvote: { type: Number, default: 0 },
  viewed: { type: Number, default: 0 },
  solved: { type: Boolean, default: false },
  user: { type: Object, ref: "User" },
  comment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
  },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
