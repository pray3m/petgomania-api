import prisma from "../config/db.js";

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

export const getOrderByIdService = async (orderId, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
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
  });

  if (!order) {
    throw { statusCode: 404, message: "Order not found." };
  }

  if (role !== "ADMIN" && order.userId !== userId) {
    throw {
      statusCode: 403,
      message: "Forbidden: Access to this order is denied.",
    };
  }

  return order;
};
