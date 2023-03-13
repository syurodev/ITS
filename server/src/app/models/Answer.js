const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerSchema = new Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  answer: { type: String },
  user: { type: Object, ref: "User" },
  upvote: { type: Array },
  downvote: { type: Array },
  solved: { type: Boolean, default: false },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comments" },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Answer", answerSchema);
