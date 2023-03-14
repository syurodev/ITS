const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentsSchema = new Schema({
  question_id: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  answer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  comment: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comments", commentsSchema);
