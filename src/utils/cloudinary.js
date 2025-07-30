import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFilePath, foldername) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: foldername,
    });

    console.log("File is uploaded on cloudinary ", response.url);
    //remove the file
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //remove the local temporary File if the upload operation failed
    fs.unlinkSync(localFilePath);
    console.error("Error uploading file to Cloudinary:", error);
    return null;
  }
};

const deleteFileOnCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    console.log("File is deleted on cloudinary ", response);
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadFileOnCloudinary, deleteFileOnCloudinary };
