import Joi from "joi";

 
export const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
  }).required(),

  paymentMethod: Joi.string()
    .valid("cash", "stripe", "paypal", "paymob")
    .required(),

  customerNote: Joi.string()
    .max(1000)
    .allow("", null),
});

 
export const orderIdSchema = Joi.object({
  orderId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.empty": "Order ID is required",
      "string.length": "Order ID must be a valid MongoDB ObjectId",
      "string.hex": "Order ID must be a valid MongoDB ObjectId",
      "any.required": "Order ID is required",
    }),
});

 
export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "returned"
    )
    .required()
    .messages({
      "any.only": "Invalid order status",
      "any.required": "Order status is required",
    }),
});