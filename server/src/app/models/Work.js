const mongoose = require("mongoose");
const { Schema } = mongoose;

const workSchema = new Schema({
  workid: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  position: { type: String, default: null },
  salary: { type: String, default: 0 },
  currency: { type: String, default: "" },
  description: { type: String },
  tags: { type: Array, default: [] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  editAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Work", workSchema);
