import { Router } from "express";
import {
  initiateCheckout,
  validateCart,
} from "../controllers/checkoutController.js";
import { authenticate } from "../middlewares/auth.js";
import {
  checkoutValidator,
  validateCartValidator,
} from "../middlewares/validations/checkoutValidations.js";
import { handleValidationErrors } from "../middlewares/validations/handleValidationErrors.js";

const router = Router();

/**
 * @route POST /checkout
 * @description Initiate checkout , create a new order , initiate payment
 * @access Private
 */
router.post(
  "/",
  authenticate,
  [...checkoutValidator, handleValidationErrors],
  initiateCheckout
);

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
