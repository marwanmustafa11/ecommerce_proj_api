import express from "express"

import { createPaymentIntent } from '../controllers/order.payment.controller.js';

import { protect } from "../middleware/auth.middleware.js"

import { validateCreateOrder } from "../middleware/validate.js"
import { createOrder } from "../controllers/order.controller.js"

const router = express.Router()

router.post("/" , 
    protect,
    validateCreateOrder,
    createOrder
)
router.post("/:id/pay" , 
    protect,
    createPaymentIntent
)

export default router;