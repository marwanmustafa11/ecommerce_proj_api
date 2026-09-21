import stripe from "../config/stripe.js";
import Order from "../models/Order.model.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          return res.status(200).json({
            received: true,
          });
        }

        const order = await Order.findById(orderId);

        if (!order) {
          return res.status(200).json({
            received: true,
          });
        }

        order.paymentStatus = "paid";
        order.paidAt = new Date();
        order.status = "confirmed";

        await order.save();

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          break;
        }

        const order = await Order.findById(orderId);

        if (!order) {
          break;
        }

        order.paymentStatus = "failed";

        await order.save();

        break;
      }

      default:
        break;
    }

    return res.status(200).json({
      received: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Webhook processing failed",
    });
  }
};