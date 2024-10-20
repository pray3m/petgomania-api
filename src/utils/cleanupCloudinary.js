// utils/cleanupCloudinary.js
import cloudinary from "../config/cloudinary.js";
import cron from "node-cron";

// Function to cleanup unused resources
const cleanupUnusedResources = async () => {
  try {
    // Get list of resources
    const { resources } = await cloudinary.api.resources({
      type: "upload",
      prefix: "pets/", // your folder name
      max_results: 500,
    });

    // Get list of resources from your database
    const dbImages = await YourModel.find().distinct("image");

    // Find resources that aren't in your database
    const unusedResources = resources.filter(
      (resource) => !dbImages.includes(resource.secure_url)
    );

    // Delete unused resources
    for (const resource of unusedResources) {
      await cloudinary.uploader.destroy(resource.public_id);
      console.log(`Cleaned up: ${resource.public_id}`);
    }
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
};

// Schedule cleanup to run daily at midnight
const scheduleCleanup = () => {
  cron.schedule("0 0 * * *", cleanupUnusedResources);
};

export { scheduleCleanup };

// In your main app.js or server.js:
import { scheduleCleanup } from "./utils/cleanupCloudinary.js";
scheduleCleanup();
