const express = require("express");
const { getURLs, deleteURL } = require("../controllers/URLController");
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/urls", verifyToken, getURLs);
router.delete("/urls/:id", verifyToken, deleteURL);

module.exports = router;
