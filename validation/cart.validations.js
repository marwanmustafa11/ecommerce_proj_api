import Joi from "joi";

export const cartSchema = Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
    "number.base":"Quantity must be a number",
    "number.integer":"Quantity must be an integer",
    "number.min":"Quantity must be at least 1",
    "any.required": "Quantity is required"
    }),
    productId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.empty": "Product ID cannot be empty",
    "string.pattern.base": "Invalid Product ID",
    "any.required": "Product ID  required"
})
}).unknown(false)
export const productIdSchema = Joi.object({

    productId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.empty": "Product ID cannot be empty",
            "string.pattern.base": "Invalid Product ID",
            "any.required": "Product ID is required"
        })
}).unknown(false)
