const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
  nev: {
    type: String,
    unique: true,
    required: true,
  },
  ar: {
    type: String,
    minlength: 1,
    required: true,
  },
  kep: {
    type: String,
    // default: "Basic",
    required: true,
  },
});

const Termek = Mongoose.model("termeks", UserSchema);

module.exports = Termek;
