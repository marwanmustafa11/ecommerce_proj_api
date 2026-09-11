import express from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";

import upload from "../middleware/upload.middleware.js";

import {validateProduct} from "../middleware/validate.js";

import {
  createProductValidation,
  updateProductValidation,
} from "../validation/product.validation.js";

const routerProduct = express.Router();

// Get All Products
routerProduct.get("/", getAllProducts);

// Get Product By ID
routerProduct.get("/:id", getProductById);

// Create Product
routerProduct.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 10),
  validateProduct(createProductValidation),
  createProduct,
);

// Update Product
routerProduct.put(
  "/update/:id",
  protect,
  adminOnly,
  upload.array("images", 10),
  validateProduct(updateProductValidation),
  updateProduct,
);

export default routerProduct;
