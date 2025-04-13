const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id; // This is critical
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = verifyToken;
