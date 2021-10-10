const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
  },
  password: String,
});

module.exports = mongoose.model("User", userSchema);
