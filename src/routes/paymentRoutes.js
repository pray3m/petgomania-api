import { Router } from "express";

const router = Router();

// POST /payments/webhook

router.post("/webhook", (req, res) => {
  res.send("Payments Route");
});

// GET /payments/status/:orderId
// POST /payments/refund/:paymentId (admin only)

// GET /payments
router.get("/", (req, res) => {
  res.send("Payments Route");
});

// GET /payments/:id
router.get("/:id", (req, res) => {
  res.send("Payments Route");
});

export default router;
