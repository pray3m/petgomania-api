import { Router } from "express";
import productRoutes from "./productRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.send("pong! 🏓");
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

export default router;
