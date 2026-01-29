import { cloudinary } from "./cloudinary.js";
import fs from "fs";
import path from "path";

const handleFileUpload = async (
  file,
  folder = "eventify",
  oldPublicId = null,
  isEvent = false,
) => {
  if (!file) return null;

  try {
    const uploadOptions = {
      folder,
      resource_type: "image",
      quality: "auto",
    };
    if (isEvent) {
      uploadOptions.width = 1200;
      uploadOptions.height = 630;
      uploadOptions.crop = "limit";
    } else {
      uploadOptions.width = 300;
      uploadOptions.height = 300;
      uploadOptions.crop = "fill";
      uploadOptions.gravity = "face";
    }

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);
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

export default handleFileUpload;
