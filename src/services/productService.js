import cloudinary from "../config/cloudinary.js";
import prisma from "../config/db.js";
import { allowedCategories } from "../utils/constants.js";
import { extractPublicId } from "../utils/helpers.js";

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
  categories,
  sortBy = "createdAt",
  sortOrder = "desc",
  search,
}) => {
  const skip = (page - 1) * limit;
  const where = {
    AND: [
      categories && categories.length > 0
        ? { category: { in: categories } }
        : {},
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

export const updateProductService = async (id, data) => {
  try {
    if (data.category && !allowedCategories.includes(data.category)) {
      throw new Error("Invalid category");
    }

    if (data.imageUrl) {
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return null;
      }

      if (existingProduct.imageUrl) {
        const publicId = extractPublicId(existingProduct.imageUrl);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        imageUrl: data.imageUrl, // This will be null if not provided
      },
    });

    return updatedProduct;
  } catch (error) {
    if (error.code === "P2025") {
      // Record not found
      return null;
    }
    throw error;
  }
};

export const deleteProductService = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return false;
    }

    if (product.imageUrl) {
      const publicId = extractPublicId(product.imageUrl);

      if (publicId) {
        const deleteResult = await cloudinary.uploader.destroy(publicId);

        if (
          deleteResult.result !== "ok" &&
          deleteResult.result !== "not found"
        ) {
          throw new Error(
            `Failed to delete image from Cloudinary: ${deleteResult.result}`
          );
        }

        console.log(`Image with publicId '${publicId}' deleted successfully.`);
      } else {
        console.error(
          "Could not extract publicId from imageUrl:",
          product.imageUrl
        );
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    return true;
  } catch (error) {
    console.error("Delete Product Error:", error);
    throw error;
  }
};
