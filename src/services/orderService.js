import prisma from "../config/db.js";
import { orderStatuses } from "../utils/constants.js";

export const createOrderService = async (userId, products) => {
  const order = await prisma.$transaction(async (tx) => {
    // Calculate total price and prepare order items
    let totalPrice = 0;
    const orderItemsData = [];

    for (const item of products) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw {
          statusCode: 404,
          message: `Product with ID ${item.productId} not found.`,
        };
      }

      if (product.stock < item.quantity) {
        throw {
          statusCode: 400,
          message: `Insufficient stock for product "${product.name}".`,
        };
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Deduct stock
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    }

    // Create the order
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalPrice,
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return newOrder;
  });

  return order;
};

export const getUserOrdersService = async (userId) => {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

export const getAllOrdersService = async () => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: { id, name, email },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    order: { createdAt: "desc" },
  });

  return orders;
};

export const getOrderByIdService = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw { statusCode: 404, message: "Order not found." };
  }

  return order;
};

export const updateOrderStatusService = async (orderId, status) => {
  if (!orderStatuses.includes(status)) {
    throw { statusCode: 400, message: "Invalid order status" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  });

  if (!order) {
    throw { statusCode: 404, message: "Order not found." };
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return updatedOrder;
};

export const deleteOrderService = async (orderId) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
    },
  });

  if (!order) {
    throw { statusCode: 404, message: "Order not found." };
  }

  await prisma.$transaction(async (tx) => {
    // Add back stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    await tx.orderItem.deleteMany({
      where: { orderId },
    });

    // Delete the order
    await tx.order.delete({ where: { id: orderId } });
  });

  return { message: "Order deleted successfully." };
};
