import {
  createOrderService,
  getUserOrdersService,
} from "../services/orderService.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { products } = req.body;

    const order = await createOrderService(userId, products);

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await getUserOrdersService(userId);

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get User Orders Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};