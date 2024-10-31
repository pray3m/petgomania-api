import { Router } from "express";
import {
  handlePaymentResponse,
  handlePaymentWebhook,
} from "../controllers/paymentController.js";

const router = Router();

router.get("/response", handlePaymentResponse);

// POST /payments/webhook
router.post("/webhook", handlePaymentWebhook);

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
