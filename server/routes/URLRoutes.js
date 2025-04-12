const express = require("express");
const { getURLs } = require("../controllers/URLController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/urls", verifyToken, getURLs);

module.exports = router;
