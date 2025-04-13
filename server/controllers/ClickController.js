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

const getClickAnalytics = async (req, res) => {
  const { urlId } = req.params;

  try {
    const clicks = await ClickModel.find({ url_id: urlId });

    // Group by date (or any other metric)
    const grouped = clicks.reduce((acc, click) => {
      const date = new Date(click.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

const getClicksForUrl = async (req, res) => {
  const { id } = req.params;

  try {
    const clicks = await ClickModel.find({ url_id: id });
    res.json(clicks);
  } catch (err) {
    console.error("Error fetching clicks:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getClicks, getClickAnalytics, getClicksForUrl };
