import express from "express"
import { 
    addItem,
    getCart,
    updateCart,
    removeItem,
    clearCart
    } from "../controllers/cart.controller.js";
import {protect} from "../middleware/auth.middleware.js"
import { 
    validateCart,
    validateProductId
} from "../middleware/validate.js";
const router=express.Router()
router.post("/carts/items",
    protect,
    validateCart,
    addItem
    
)
router.get("/carts",
    protect,
    getCart
    
)
router.patch("/carts/items",
    protect,
    validateCart,
    updateCart
)
router.delete("/carts/items/:productId",
    protect,
    validateProductId,
    removeItem
)
router.delete("/carts/clear",
    protect,
    clearCart
)
export default router;
