const cloudinary = require("./cloudinary");
const fs = require("fs");
const path = require("path");

const handleFileUpload = async (
  file,
  folder = "eventify",
  oldPublicId = null,
) => {
  if (!file) return null;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
      width: 300,
      height: 300,
      crop: "fill",
      gravity: "face",
      quality: "auto",
    });

    if (oldPublicId) {
      await cloudinary.uploader.destroy(oldPublicId);
    }

    fs.unlinkSync(path.join(process.cwd(), "uploads", file.filename));

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  } catch (error) {
    if (file?.filename) {
      const localPath = path.join(process.cwd(), "uploads", file.filename);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }
    console.error("File upload error:", error);
    throw new Error("Image upload failed");
  }
};

module.exports = handleFileUpload;
