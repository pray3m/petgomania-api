import { Router } from "express";
import { validateCartValidator } from "../middlewares/validations/checkoutValidations.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";
import { authenticate } from "../middlewares/auth.js";
import { validateCart } from "../controllers/checkoutController.js";

const router = Router();

/**
 * @route POST /checkout/validate-cart
 * @description Validate cart items, check stock and prices
 * @access Private
 */
router.post(
  "/validate-cart",
  authenticate,
  [...validateCartValidator, handleValidationErrors],
  validateCart
);

//TODO:
// router.post("/shipping/calculate", auth, checkoutController.calculateShipping);
// router.post("/tax/calculate", auth, checkoutController.calculateTax);
// router.get("/payment-methods", auth, checkoutController.getPaymentMethods);
// router.post("/payment-intent", auth, checkoutController.createPaymentIntent);
// router.post("/complete", auth, checkoutController.completeCheckout); // Final checkout processing

export default router;
