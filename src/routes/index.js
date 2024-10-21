import { Router } from "express";
import productRoutes from "./productRoutes.js";
import authRoutes from "./authRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import petRoutes from "./petRoutes.js";
import checkoutRoutes from "./checkoutRoutes.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.send("pong! 🏓");
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

/**
 * Pet Routes
 * GET    /api/pets                    // List pets (with filters)
 * POST   /api/pets                    // Create pet listing
 * GET    /api/pets/:id               // Get pet details
 * PATCH  /api/pets/:id/status        // Update pet status
 * POST   /api/pets/:id/adopt         // Submit adoption request
 */
router.use("/pets", petRoutes);

/**
 * GET    /api/adoptions/my-requests  // View my adoption requests
 * GET    /api/adoptions/my-pets
 * PATCH  /api/adoptions/:id/status   // Update adoption status
 */

/**
GET    /api/conversations                   - List all conversations
GET    /api/conversations/:id               - Get single conversation
GET    /api/conversations/:id/messages      - Get conversation messages
 */

export default router;
