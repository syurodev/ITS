import mongoose from "mongoose";
const { Schema } = mongoose;

const answerSchema = new Schema({
  questionid: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  answer: { type: String },
  user: { type: Object, ref: "User" },
  upvote: { type: Number, default: 0 },
  downvote: { type: Number, default: 0 },
  solved: { type: Boolean, default: false },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comments" },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", answerSchema);
