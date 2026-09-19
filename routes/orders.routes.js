import express from "express"

import { protect } from "../middleware/auth.middleware.js"

import { validateCreateOrder } from "../middleware/validate.js"
import { createOrder } from "../controllers/order.controller.js"

const router = express.Router()

router.post("/" , 
    protect,
    validateCreateOrder,
    createOrder
)

export default router;