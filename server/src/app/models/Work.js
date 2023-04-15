const mongoose = require("mongoose");
const { Schema } = mongoose;

const workSchema = new Schema({
  workid: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  position: { type: String },
  detail: { type: String },
  salary: { type: String },
  tags: { type: Array },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Work", workSchema);
