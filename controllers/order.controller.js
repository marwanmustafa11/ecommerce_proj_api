import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";
import mongoose from "mongoose";
import { sendOrderConfirmationEmail } from "../utils/orderEmail.js";

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

    if (cart.items.length == 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({
      _id: { $in: productIds },
    }).session(session);

    if (cart.items.length != products.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "One or more products in the cart no longer exist",
      });
    }

    for (const item of cart.items) {
      const product = products.find((p) => p._id.equals(item.product));
      if (!product || product.stock < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product ? product.name : "Unknown"}`,
        });
      }
    }

    const items = cart.items.map((item) => {
      const product = products.find((product) =>
        product._id.equals(item.product)
      );

      return {
        product: product._id,
        name: product.name,
        image: product.images[0].url,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const subtotal = cart.subtotal;
    const discount = cart.discountAmount;
    const taxableAmount = cart.total; 

    const shippingFee = subtotal > 1000 ? 0 : 50;
    
    const tax = Number((taxableAmount * 0.14).toFixed(2));

    const totalPrice = tax + taxableAmount + shippingFee;

    const order = await Order.create([{
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
      orderStatus: "pending",
    }], { session });

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    cart.items = []; 
    cart.coupon = undefined;
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    const orderWithUser = await Order.findById(order[0]._id).populate("user");
    try{
      await sendOrderConfirmationEmail(orderWithUser)
    }catch(error){
      console.error("Failed to send order confirmation email:", error.message);
    }

    return res.status(201).json({
      success: true,
      message: "order created successfully",
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid order data",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};








export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId }).session(session);

    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "cancelled") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    order.orderStatus = "cancelled";
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
    });//mmmmmm
  }
};