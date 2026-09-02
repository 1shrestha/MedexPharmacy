import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(base64File: string, folder: string) {
  return cloudinary.uploader.upload(base64File, {
    folder: `medex-pharmacy/${folder}`,
    resource_type: "auto",
  });
}

export default cloudinary;
