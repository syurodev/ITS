const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  questionid: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  body: { type: String },
  tags: { type: Array },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
