const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  questionid: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  problem: { type: String },
  expecting: { type: String },
  tags: { type: Array },
  upvote: { type: Array },
  downvote: { type: Array },
  viewed: { type: Number, default: 0 },
  solved: { type: Boolean, default: false },
  solved_answer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
