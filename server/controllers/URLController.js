const ClickModel = require("../models/ClickModel");
const URLModel = require("../models/URLModel");
const cloudinary = require("cloudinary").v2;
const QRCode = require("qrcode");
require("dotenv").config({ path: "./.env" });

const getURLs = async (req, res) => {
  try {
    const urls = await URLModel.find({ user_id: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(urls);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to fetch URLs" });
  }
};

const deleteURL = async (req, res) => {
  try {
    const urlId = req.params.id;

    // First, delete the URL
    await URLModel.findByIdAndDelete(urlId);

    // Then, delete associated clicks
    await ClickModel.deleteMany({ url_id: urlId });

    res.status(200).json({ message: "URL and related clicks deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete URL and clicks" });
  }
};

const createURL = async (req, res) => {
  const { title, longUrl, customUrl } = req.body;
  const user_id = req.userId; // Extract user_id from the authenticated user

  try {
    const short_url = Math.random().toString(36).substr(2, 6);
    const fileName = `qr-${short_url}`;

    // Generate QR code as Data URL
    const qrDataUrl = await QRCode.toDataURL(longUrl);

    // Convert base64 Data URL to Blob
    const resBlob = await fetch(qrDataUrl);
    const blob = await resBlob.blob();

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", "unsigned_qr_upload");
    formData.append("folder", "qrs");
    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/drabxbmsa/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = await cloudinaryRes.json();

    if (!uploadData.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    // Create URL object in MongoDB
    const newUrl = await URLModel.create({
      title,
      user_id, // Use the user_id extracted from the token
      original_url: longUrl,
      custom_url: customUrl || "",
      qr: uploadData.secure_url,
      short_url,
    });

    // Send the new URL data back to the client
    return res.status(201).json(newUrl);
  } catch (err) {
    console.error("Error creating short URL:", err);
    return res
      .status(500)
      .json({ message: "Error creating short URL", error: err });
  }
};

const getLongUrl = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const urlDoc = await URLModel.findOne({ short_url: shortUrl });

    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // ✅ Increment click count in the URL model
    urlDoc.clicks = (urlDoc.clicks || 0) + 1;
    await urlDoc.save();

    // ✅ Record click analytics
    const userAgent = req.get("User-Agent");
    const ip = req.ip || req.connection.remoteAddress;
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoRes.json();

    // Use a placeholder or external service for geolocation — for now, mock it
    const click = new ClickModel({
      country: geoData.country || "Unknown",
      city: geoData.city || "Unknown",
      device: userAgent,
      url_id: urlDoc._id,
    });

    await click.save();

    // ✅ Redirect to the original URL
    return res.redirect(urlDoc.original_url);
  } catch (err) {
    console.error("Error in getLongUrl:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const getUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    const url = await URLModel.findById(id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.json(url);
  } catch (err) {
    console.error("Error fetching URL:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getURLs, deleteURL, createURL, getLongUrl, getUrlById };
