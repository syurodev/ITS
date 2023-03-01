import mongoose from "mongoose";
const { Schema } = mongoose;

const answerSchema = new Schema({
  questionid: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  answer: { type: String },
  user: { type: Object },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", answerSchema);
