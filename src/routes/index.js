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

router.use("/pets", petRoutes);

/**
POST    /api/conversations                  - Create  conversations
GET    /api/conversations                   - List all conversations
GET    /api/conversations/:id/messages      - Get conversation messages
 */


export default router;
