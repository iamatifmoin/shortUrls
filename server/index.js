const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
require("dotenv").config({ path: "./.env" });

const app = express();
const db = process.env.MONGODB_URI;

// ✅ Mongoose connection
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "shortUrls",
  })
  .then(() => console.log("✅ Connected to MongoDB via Mongoose"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes);

app.listen(4000, () => {
  console.log("🚀 Server started on Port 4000");
});
