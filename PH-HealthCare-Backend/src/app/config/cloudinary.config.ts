import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;
