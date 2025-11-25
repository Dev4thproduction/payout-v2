// routes/productRoutes.js
import express from "express";
import {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

const router = express.Router();

// ✅ Routes
router.post("/", addProduct);       // Create product
router.get("/", getProducts);       // Get all products
router.put("/:id", updateProduct);  // Update product by ID
router.delete("/:id", deleteProduct); // Delete product by ID

export default router;
