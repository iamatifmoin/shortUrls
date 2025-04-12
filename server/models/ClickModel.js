const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  country: {
    type: String,
    default: "",
  },
  device: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  url_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Urls",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Clicks", clickSchema);
