const express = require("express");
const { getClicks } = require("../controllers/ClickController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/clicks", verifyToken, getClicks);

module.exports = router;
