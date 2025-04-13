const express = require("express");
const {
  getClicks,
  getClicksForUrl,
} = require("../controllers/ClickController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/clicks", verifyToken, getClicks);
router.get("/clicks/:id", getClicksForUrl);

module.exports = router;
