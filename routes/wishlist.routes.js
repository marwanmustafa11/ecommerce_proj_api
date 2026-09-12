import express from "express";

import {
    getWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    clearWishlist,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middleware/auth.middleware.js";

import { validateProductId } from "../middleware/validate.js";

const router = express.Router();

// Get Wishlist
router.get("/", protect, getWishlist);

// Add Product
router.post(
    "/:productId",
    protect,
    validateProductId,
    addProductToWishlist
);

// Remove Product
router.delete(
    "/:productId",
    protect,
    validateProductId,
    removeProductFromWishlist
);

// Clear Wishlist
router.delete("/", protect, clearWishlist);

export default router;