const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    unique: true,
  },
  custom_url: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  qr: {
    type: String,
    default: "",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Urls", urlSchema);
