import { createProductService } from "../services/productService.js";

export const createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json({ message: "Product created successfully.", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};
