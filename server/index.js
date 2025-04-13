const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/AuthRoutes");
const urlRoutes = require("./routes/URLRoutes");
const clickRoutes = require("./routes/ClickRoutes");
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
    origin: ["https://tinieurlz.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes);
app.use("/", urlRoutes);
app.use("/", clickRoutes);
app.get("/", (req, res) => {
  res.send("🟢 API is running. Use the frontend to interact.");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on Port ${PORT}`);
});
