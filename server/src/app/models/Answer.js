const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerSchema = new Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  answer: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  upvote: { type: Array },
  downvote: { type: Array },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Answer", answerSchema);
