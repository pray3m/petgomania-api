import { validationResult } from "express-validator";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cloudinary from "../../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there's a file upload and validation failed, delete from Cloudinary
    if (req.file && req.file.path) {
      try {
        // Extract public_id from Cloudinary URL
        const publicId =
          req.file.filename ||
          req.file.path.split("/").slice(-1)[0].split(".")[0];

        // Delete the uploaded file from Cloudinary
        cloudinary.uploader
          .destroy(publicId)
          .catch((err) =>
            console.error("Failed to delete from Cloudinary:", err)
          );
      } catch (err) {
        console.error("Error handling Cloudinary cleanup:", err);
      }
    }

    const simplifiedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: simplifiedErrors,
    });
  }

  next();
};

/* Example Response:
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    },
    {
      "field": "age",
      "message": "Age must be a positive number"
    }
  ]
}
*/
