import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  searchProductsService,
  updateProductService,
} from "../services/productService.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl;

    if (req.file && req.file.path) {
      imageUrl = req.file.path; // Cloudinary returns the image URL in req.file.path
    }

    const product = await createProductService({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock),
      imageUrl,
    });
    res.status(201).json({
      status: "success",
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const { page, limit, category, sortBy, sortOrder, search } = req.query;

    const categoriesArray = category
      ? category.split(",").map((cat) => cat.trim())
      : [];

    const result = await getAllProductsService({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      categories: categoriesArray,
      sortBy,
      sortOrder,
      search,
    });

    res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      products: result.products,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req, res, next) => {
  const { query, page, limit } = req.query;
  try {
    const result = await searchProductsService({
      query,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });
    res.status(200).json({
      status: "success",
      message: "Products retrieved successfully",
      products: result.products,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(parseInt(id));

    res.status(200).json({
      status: "success",
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock } = req.body;

    let imageUrl;
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (category) updateData.category = category;
    if (stock) updateData.stock = parseInt(stock);
    if (imageUrl) updateData.imageUrl = imageUrl;

    const product = await updateProductService(parseInt(id), updateData);

    res.status(200).json({
      status: "success",
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const productId = parseInt(id, 10);

    await deleteProductService(productId);
    res
      .status(200)
      .json({ status: "success", message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};
