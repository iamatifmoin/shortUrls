const express = require("express");
const {
  getClicks,
  getClicksForUrl,
} = require("../controllers/ClickController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// For multiple URLs (used in Dashboard)
router.get("/clicks", verifyToken, getClicks); // expects ?urlIds=id1,id2,id3

// For single URL (used in LinkAnalytics)
router.get("/clicks/for/:id", getClicksForUrl); // renamed to prevent conflict

module.exports = router;
