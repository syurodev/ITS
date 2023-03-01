import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
  questionid: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  comment: { type: Object },
  user: { type: Object },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", commentSchema);
