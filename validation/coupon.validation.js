import Joi from "joi";

export const applyCouponSchema = Joi.object({
    code: Joi.string().trim().min(3).max(20).required().messages({
        "string.empty": "Coupon code is required",
        "any.required": "Coupon code is required",
    })
})