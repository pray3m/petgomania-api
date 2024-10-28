import {
  initiateCheckoutService,
  validateCartService,
} from "../services/checkoutService.js";

export const initiateCheckout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cartItems, shippingDetails, paymentMethod } = req.body;

    const { paymentUrl, orderId } = await initiateCheckoutService({
      userId,
      cartItems,
      shippingDetails,
      paymentMethod,
    });

    res.status(200).json({ paymentUrl, orderId });
  } catch (error) {
    next(error);
  }
};

export const validateCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    const validationResponse = await validateCartService(items);

    res.status(200).json({
      status: "success",
      message: "Cart is valid.",
      data: validationResponse,
    });
  } catch (error) {
    next(error);
  }
};
