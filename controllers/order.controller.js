import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";
import Cart from "../models/Cart.model.js";
import { sendOrderConfirmationEmail } from "../utils/orderEmail.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (cart.items.length == 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (cart.items.length != products.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products in the cart no longer exist",
      });
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
    const taxableAmount = cart.total; // السعر بعد الخصم

    const shippingFee = subtotal > 1000 ? 0 : 50;
    // حسبت الضريبة على السعر بعد الخصم
    const tax = Number((taxableAmount * 0.14).toFixed(2));

    const totalPrice = tax + taxableAmount + shippingFee;

    const order = await Order.create({
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
    });

    const orderWithUser = await Order.findById(order._id).populate("user");
    try{
      await sendOrderConfirmationEmail(orderWithUser)

    }catch(error){
      //رساله للباك اند يعرفه ان الايميل متبعتش لكن مش هياثر علي طلب الاوردر
      console.error("Failed to send order confirmation email:", error.message);
    }

    cart.items = []; //هتتظبط لما الtransactionيتعمل 
    cart.coupon = undefined;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "order created successfully",
      order,
    });
  } catch (error) {
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
    });
  }
};