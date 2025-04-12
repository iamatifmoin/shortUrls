// controllers/ClickController.js
const ClickModel = require("../models/ClickModel");

const getClicks = async (req, res) => {
  try {
    const { urlIds } = req.query;
    const idsArray = urlIds?.split(",") || [];

    const clicks = await ClickModel.find({ url_id: { $in: idsArray } });
    res.status(200).json(clicks);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to fetch Clicks" });
  }
};

module.exports = { getClicks };
