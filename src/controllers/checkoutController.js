import { validateCartService } from "../services/checkoutService.js";

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