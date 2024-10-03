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

export const getAllProductsService = async ({
  page = 1,
  limit = 10,
  category,
  sortBy = "createdAt",
  sortOrder = "desc",
  search,
}) => {
  const skip = (page - 1) * limit;
  const where = {
    AND: [
      category ? { category } : {},
      search
        ? {
            OR: [
              { name: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {},
    ],
  };
  const sortableFields = ["price"];
  if (!sortableFields.includes(sortBy)) {
    sortBy = "createdAt";
  }

  sortOrder = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    products,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const getProductByIdService = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });
  return product;
};
