import express from "express";
import {
    getWishlist,
    addProductToWishlist,
    removeProductFromWishlist,
    clearWishlist,
} from "../controllers/wishlist.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateWishlistProductId } from "../middleware/validate.js";

const router = express.Router();

 
router.get("/", protect, getWishlist);
 
router.post(
    "/:productId",
    protect,
    validateWishlistProductId,
    addProductToWishlist
);

router.delete(
    "/:productId",
    protect,
    validateWishlistProductId,
    removeProductFromWishlist
);

router.delete("/", protect, clearWishlist);

export default router;