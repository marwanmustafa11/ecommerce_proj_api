import express from "express";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";
import { createPaymentIntent } from '../controllers/order.payment.controller.js';
// import { handleStripeWebhook } from "../controllers/order.webhook.controller.js";


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
  getMyOrders,
  getMyOrderById,
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
  "/my/:orderId/cancel",
  protect,
  validateOrderId,
  cancelOrder
);


router.post("/:id/pay" , 
    protect,
    createPaymentIntent
)


router.get(
  "/my",
  protect,
  getMyOrders
);

router.get(
  "/my/:orderId",
  protect,
  validateOrderId,
  getMyOrderById
);

// router.post("/webhook" , 
// express.raw({ type: "application/json" }),
//   handleStripeWebhook
// )


export default router;