const fs = require("fs");
const path = require("path");

const deleteImage = (imageName) => {
  try {
    if (!imageName) {
      return;
    }

    const imagePath = path.join(process.cwd(), "uploads", imageName);
    console.log("image path : ", imagePath);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("image deleted : ", imageName);
    } else {
      console.log("image not found : ", imageName);
    }
  } catch (error) {
    console.log("Error deleting image : ", error.message);
  }
};

module.exports = { deleteImage };
