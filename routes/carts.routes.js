import express from "express"
import { 
    addItem,
    getCart,
    updateCart,
    removeItem,
    clearCart
    } from "../controllers/cart.controller.js";
import {
    applyCoupon,
    removeCoupon
} from "../controllers/coupon.controller.js";
import {protect} from "../middleware/auth.middleware.js"
import { 
    validateCart,
    validateProductId,
    validateCoupon
} from "../middleware/validate.js";
const router=express.Router()
router.post("/items",
    protect,
    validateCart,
    addItem
    
)
router.get("/",
    protect,
    getCart
    
)
router.patch("/items",
    protect,
    validateCart,
    updateCart
)
router.delete("/items/:productId",
    protect,
    validateProductId,
    removeItem
)
router.delete("/clear",
    protect,
    clearCart
)

// Apply & Remove coupon from cart
router.post("/coupon",
    protect,
    validateCoupon,
    applyCoupon
);
router.delete("/coupon",
    protect,
    removeCoupon
);

export default router;
