import express from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  searchProducts,
  deleteProduct
} from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";

import upload from "../middleware/upload.middleware.js";

import {
  validate,
  validateSearchProducts,
} from "../middleware/validate.js";

import {
  createProductValidation,
  updateProductValidation,
} from "../validation/product.validation.js";

const routerProduct = express.Router();

// Get All Products
routerProduct.get("/", getAllProducts);

routerProduct.get("/search", validateSearchProducts, searchProducts);

// Get Product By ID
routerProduct.get("/:id", getProductById);


// Create Product
routerProduct.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  validate(createProductValidation),
  createProduct,
);

// Update Product
routerProduct.put(
  "/update/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  validate(updateProductValidation),
  updateProduct,
);

// Delete Product
routerProduct.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

export default routerProduct;
