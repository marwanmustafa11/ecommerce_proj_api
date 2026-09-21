import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";
import mongoose from "mongoose";

import {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} from "../utils/orderEmail.js";


 
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).session(session);

    if (!cart) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // جلب المنتجات الموجودة في الـ Cart
    const productIds = cart.items.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    if (cart.items.length !== products.length) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "One or more products in the cart no longer exist",
      });
    }

    // التأكد إن الـ stock كافي
    for (const item of cart.items) {
      const product = products.find((p) =>
        p._id.equals(item.product)
      );

      if (!product || product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${
            product ? product.name : "Unknown"
          }`,
        });
      }
    }

    // تجهيز Items الخاصة بالـ Order
    const items = cart.items.map((item) => {
      const product = products.find((product) =>
        product._id.equals(item.product)
      );

      return {
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price: product.price,
        quantity: item.quantity,
      };
    });

    const subtotal = cart.subtotal;
    const discount = cart.discountAmount;
    const taxableAmount = cart.total;

    const shippingFee = subtotal > 1000 ? 0 : 50;

    // حساب الضريبة على السعر بعد الخصم
    const tax = Number((taxableAmount * 0.14).toFixed(2));

    const totalPrice = tax + taxableAmount + shippingFee;

    // إنشاء الـ Order
    const order = await Order.create(
      [
        {
          user: userId,
          items,
          shippingAddress: req.body.shippingAddress,
          paymentMethod: req.body.paymentMethod,
          subtotal,
          shippingFee,
          tax,
          discount,
          totalPrice,
          customerNote: req.body.customerNote,
          status: "pending",
        },
      ],
      { session }
    );

    // خصم الـ stock بعد إنشاء الـ Order
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // تفريغ الـ Cart
    cart.items = [];
    cart.coupon = undefined;

    await cart.save({ session });

    // إنهاء الـ Transaction
    await session.commitTransaction();
    session.endSession();

    // إرسال Confirmation Email
    const orderWithUser = await Order.findById(order[0]._id)
      .populate("user");

    try {
      await sendOrderConfirmationEmail(orderWithUser);
    } catch (error) {
      console.error(
        "Failed to send order confirmation email:",
        error.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: order[0],
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// Task 22
// Cancel Order + Restore Stock
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // التأكد إن الطلب لم يتم إلغاؤه بالفعل
    if (order.status === "cancelled") {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    // الإلغاء مسموح فقط في pending أو confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled when status is ${order.status}`,
      });
    }

    // استرجاع الـ stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    // تغيير حالة الـ Order
    order.status = "cancelled";
    order.cancelledAt = new Date();

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully and stock restored",
      order,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};


// Task 26 - Admin: Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email phone")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};


// Task 26 - Admin: Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "username email phone")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};


// Task 26 - Admin: Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // جلب الـ Order مع بيانات الـ User
    const order = await Order.findById(orderId)
      .populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const currentStatus = order.status;

    // منع تغيير الـ Order لنفس الـ Status
    if (currentStatus === status) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${status}`,
      });
    }

    // الـ Status transitions المسموحة
    const allowedTransitions = {
      pending: ["confirmed"],
      confirmed: ["processing"],
      processing: ["shipped"],
      shipped: ["delivered"],
      delivered: ["returned"],
      cancelled: [],
      returned: [],
    };

    // التأكد إن الـ transition مسموح
    if (!allowedTransitions[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${currentStatus} to ${status}`,
      });
    }

    // تغيير الـ Status
    order.status = status;

    // تسجيل وقت التسليم
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

        // Task 25 - إرسال Email
    // بنستخدم الـ function الموجودة بالفعل
        try {
      await sendOrderStatusEmail(order);
    } catch (error) {
      // فشل الإيميل لا يلغي تحديث الـ Order
      console.error(
        "Failed to send order status email:",
        error.message
      );
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated from ${currentStatus} to ${status}`,
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const userId=req.user._id

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page-1)*limit;

    const filter = {
      user: userId,
    }

    if(req.query.status){
      filter.status = req.query.status
    }

    const total = await Order.countDocuments(filter)


    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const totalPages= Math.ceil(total / limit)

    return res.status(200).json({
      success: true,
      total,
      currentPage:page,
      totalPages,
      orders
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get orders",
      error: error.message,
    });
  }
};

export const getMyOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findById({
      _id:orderId,
      user: userId
    })
 

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get order",
      error: error.message,
    });
  }
};


