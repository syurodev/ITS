const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: mongoose.Schema.Types.ObjectId },
  username: { type: String, default: null },
  avatar: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: Number, default: null },
  password: { type: String, default: null },
  dateCreate: { type: Date, default: Date.now },
  role: { type: Number, default: 1 },
  reputationScore: { type: Number, default: 0 },
  bookmark: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

module.exports = mongoose.model("User", userSchema);
