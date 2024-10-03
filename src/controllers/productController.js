import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
} from "../services/productService.js";

export const createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body);
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
  } catch (error) {
    console.error("Update product error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
