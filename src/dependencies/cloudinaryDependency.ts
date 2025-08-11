import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import { getSafeEnvironmentVar } from "../utils/utils.js";

const CLOUDINARY_CLOUD_NAME = getSafeEnvironmentVar("CLOUDINARY_CLOUD_NAME");
const CLOUDINARY_API_KEY = getSafeEnvironmentVar("CLOUDINARY_API_KEY");
const CLOUDINARY_API_SECRET = getSafeEnvironmentVar("CLOUDINARY_API_SECRET");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const cloudinaryClient = cloudinary;
