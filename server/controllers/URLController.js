const ClickModel = require("../models/ClickModel");
const URLModel = require("../models/URLModel");
const cloudinary = require("../utils/cloudinary");

const getURLs = async (req, res) => {
  try {
    const urls = await URLModel.find({ user_id: req.userId });
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

const createURL = async (
  { title, longUrl, customUrl, user_id },
  qrcodeBuffer
) => {
  try {
    const short_url = Math.random().toString(36).substr(2, 6);
    const fileName = `qr-${short_url}`;

    // Upload the QR code buffer to Cloudinary
    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "qrs",
        public_id: fileName,
        format: "png",
      },
      async (error, result) => {
        if (error) throw new Error("QR upload failed");

        const qr = result.secure_url;

        const newUrl = await URLModel.create({
          title,
          user_id,
          original_url: longUrl,
          custom_url: customUrl || "",
          short_url,
          qr,
        });

        return newUrl;
      }
    );

    // Pipe buffer into Cloudinary stream
    const stream = cloudinary.uploader.upload_stream(uploadResult);
    stream.end(qrcodeBuffer);
  } catch (err) {
    console.error("Error creating short URL:", err);
    throw new Error("Error creating short URL");
  }
};

module.exports = { getURLs, deleteURL, createURL };
