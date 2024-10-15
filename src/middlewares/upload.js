import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const ALLOWED_FORMATS = ["jpg", "jpeg", "png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `petgomania/${folder}`,
      allowed_formats: ALLOWED_FORMATS,
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });
};

const createParser = (storage) => {
  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      const ext = file.originalname.split(".").pop().toLowerCase();
      if (!ALLOWED_FORMATS.includes(ext)) {
        return cb(
          new Error(`Only ${ALLOWED_FORMATS.join(", ")} files are allowed.`)
        );
      }
      cb(null, true);
    },
  });
};

const productUpload = createParser(createStorage("products"));
const petUpload = createParser(createStorage("pets"));

export { productUpload, petUpload };
