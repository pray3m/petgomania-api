import {
  createOrderService,
  getOrderByIdService,
  getUserOrdersService,
  updateOrderStatusService,
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

export const getOrderById = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const user = req.user;

    const order = await getOrderByIdService(orderId);

    // If user is not admin, verify ownership
    if (user.role !== "ADMIN" && order.userId !== user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access to this order." });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Get Order By Id Error:", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const { status } = req.body;

    const updatedOrder = await updateOrderStatusService(orderId, status);

    res
      .status(200)
      .json({ message: "Order status updated.", order: updatedOrder });
  } catch (error) {
    console.error("Updating order status error: ", error);
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  }
};
