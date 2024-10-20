import cloudinary from "../config/cloudinary.js";
import prisma from "../config/db.js";
import AppError from "../utils/AppError.js";
import { allowedCategories } from "../utils/constants.js";
import { handleServiceError } from "../utils/handleServiceError.js";
import { extractPublicId } from "../utils/helpers.js";

export const createProductService = async ({
  name,
  description,
  price,
  category,
  stock,
  imageUrl,
}) => {
  try {
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
  } catch (error) {
    handleServiceError(error, "adding product");
  }
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

  try {
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
  } catch (error) {
    handleServiceError(error, "Get Products Error");
  }
};

export const getProductByIdService = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError(404, `Product with ID ${id} not found`);
    }

    return product;
  } catch (error) {
    handleServiceError(error, "retrieving product");
  }
};

export const updateProductService = async (id, data) => {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError(404, `Product with ID ${id} doesn't exist.`);
    }

    // Handle image update if new image is provided
    if (data.imageUrl && existingProduct.imageUrl) {
      try {
        const publicId = extractPublicId(existingProduct.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
          });
        }
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
        // Continue with update even if image deletion fails
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });

    return updatedProduct;
  } catch (error) {
    handleServiceError(error, "Updating product.");
  }
};

export const deleteProductService = async (id) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // Find the product first
      const product = await tx.product.findUnique({
        where: { id },
        select: {
          id: true,
          imageUrl: true,
          name: true,
        },
      });

      if (!product) {
        throw new AppError(404, `Product with ID ${id} not found`);
      }

      // Delete image from Cloudinary if exists
      if (product.imageUrl) {
        const publicId = extractPublicId(product.imageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId, {
              invalidate: true,
              resource_type: "image",
            });
          } catch (cloudinaryError) {
            console.error("Failed to delete image from Cloudinary:", {
              id,
              error: cloudinaryError.message,
            });
          }
        }
      }

      await tx.product.delete({
        where: { id },
      });

      return true;
    });
  } catch (error) {
    handleServiceError(error, "deleting product");
  }
};
