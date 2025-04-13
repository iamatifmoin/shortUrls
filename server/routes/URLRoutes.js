const express = require("express");
const {
  getURLs,
  deleteURL,
  createURL,
  getLongUrl,
  getUrlById,
} = require("../controllers/URLController"); // Include the createURL controller
const verifyToken = require("../middlewares/authMiddleware");

const router = express.Router();

// GET all URLs for the authenticated user
router.get("/urls", verifyToken, getURLs);

// DELETE a URL by ID
router.delete("/urls/:id", verifyToken, deleteURL);

// POST a new URL (Create URL)
router.post("/urls", verifyToken, createURL); // Add a POST route for URL creation

router.get("/:shortUrl", getLongUrl);

router.get("/urls/:id", getUrlById);

module.exports = router;
