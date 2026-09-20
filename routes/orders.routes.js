import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";
import { createPaymentIntent } from '../controllers/order.payment.controller.js';


import {
  validateCreateOrder,
  validateOrderId,
  validateUpdateOrderStatus,
} from "../middleware/validate.js";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = express.Router();


// User: Create Order
router.post(
  "/",
  protect,
  validateCreateOrder,
  createOrder
);


// Admin: Get All Orders
router.get(
  "/admin",
  protect,
  adminOnly,
  getAllOrders
);


// Admin: Get Order By ID
router.get(
  "/admin/:orderId",
  protect,
  adminOnly,
  validateOrderId,
  getOrderById
);


// Admin: Update Order Status
router.patch(
  "/admin/:orderId/status",
  protect,
  adminOnly,
  validateOrderId,
  validateUpdateOrderStatus,
  updateOrderStatus
);


// Admin: Cancel Order
router.patch(
  "/admin/:orderId/cancel",
  protect,
  adminOnly,
  validateOrderId,
  cancelOrder
);

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