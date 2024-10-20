import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const UPLOAD_CONFIG = {
  ALLOWED_FORMATS: ["jpg", "jpeg", "png"],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  IMAGE_CONFIG: {
    width: 500,
    height: 500,
    crop: "limit",
    quality: "auto", // Automatically optimize quality
    fetch_format: "auto", // Automatically choose best format
    flags: "lossy", // Enable lossy compression
    strip: true, // Strip metadata to reduce size
  },
};

/**
 * Creates Cloudinary storage configuration
 * @param {string} folder - Destination folder in Cloudinary
 * @returns {CloudinaryStorage} Configured storage instance
 */
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: UPLOAD_CONFIG.ALLOWED_FORMATS,
      transformation: [UPLOAD_CONFIG.IMAGE_CONFIG],
    },
  });
};

const createParser = (storage) => {
  return multer({
    storage,
    limits: { fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE, files: 5 },
    fileFilter: (req, file, cb) => {
      const ext = file.originalname.split(".").pop().toLowerCase();
      if (!UPLOAD_CONFIG.ALLOWED_FORMATS.includes(ext)) {
        return cb(
          new Error(
            `Only ${UPLOAD_CONFIG.ALLOWED_FORMATS.join(
              ", "
            )} files are allowed.`
          )
        );
      }
      cb(null, true);
    },
  });
};

const productUpload = createParser(createCloudinaryStorage("products"));
const petUpload = createParser(createCloudinaryStorage("pets"));

export { productUpload, petUpload };
