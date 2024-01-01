const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  task: String,
  username: String,
});

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;
