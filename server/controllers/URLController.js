const URLModel = require("../models/URLModel");

const getURLs = async (req, res) => {
  try {
    const urls = await URLModel.find({ user_id: req.userId });
    res.status(200).json(urls);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to fetch URLs" });
  }
};

module.exports = { getURLs };
