const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/its");
    console.log("Connect Successfully!!!");
  } catch (error) {
    console.log("Connect Failure", error);
  }
}

module.exports = { connect };
