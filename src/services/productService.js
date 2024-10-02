import prisma from "../config/db.js";

export const createProductService = async ({
  name,
  description,
  price,
  category,
  stock,
  imageUrl,
}) => {
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
    },
  });
  return product;
};
