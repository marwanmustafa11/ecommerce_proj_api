import stripe from '../config/stripe.js';
import Order from '../models/Order.model.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You do not own this order",
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: "This order is already paid",
      });
    }

    const amount = order.totalPrice || order.totalOrderPrice || order.total;
    const amountInCents = Math.round(amount * 100);


    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'egp',
      payment_method_types: ['card'],
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    order.stripePaymentIntentId = paymentIntent.id;
    order.transactionId = paymentIntent.id;
    order.paymentMethod = 'stripe';
    await order.save();

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};