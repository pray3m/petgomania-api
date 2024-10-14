import { Router } from "express";
import productRoutes from "./productRoutes.js";
import authRoutes from "./authRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.send("pong! 🏓");
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);

export default router;
