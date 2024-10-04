import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} from "../services/productService.js";

export const createProduct = async (req, res) => {
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
    res.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { page, limit, category, sortBy, sortOrder, search } = req.query;

    const result = await getAllProductsService({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      category,
      sortBy,
      sortOrder,
      search,
    });

    res.status(200).json({ ...result });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(parseInt(id));
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
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
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product updated successfully.", product });
  } catch (error) {
    console.error("Update product error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ error: "Invalid product ID." });
    }
    const deletionSuccess = await deleteProductService(productId);
    if (!deletionSuccess) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
