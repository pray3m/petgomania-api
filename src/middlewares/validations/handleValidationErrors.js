import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Only  locally (not applicable for Cloudinary directly)
    if (req.file) {
      const filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
      });
    }

    // Map errors to a simple array of field and message
    const simplifiedErrors = errors.array().map((error) => ({
      field: error.param,
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
