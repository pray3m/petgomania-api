import { Router } from "express";
import authRoutes from "./authRoutes.js";
import checkoutRoutes from "./checkoutRoutes.js";
import conversationRoutes from "./conversationRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import petRoutes from "./petRoutes.js";
import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.send("pong! 🏓");
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

router.use("/products", productRoutes);

router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

router.use("/pets", petRoutes);
router.use("/conversations", conversationRoutes);

export default router;
