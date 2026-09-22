import Joi from "joi";

 
const wishlistProductIdSchema = Joi.object({
    productId: Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.empty": "Product ID is required",
            "string.length": "Product ID must be a valid MongoDB ObjectId",
            "string.hex": "Product ID must be a valid MongoDB ObjectId",
            "any.required": "Product ID is required",
        }),
});

export { wishlistProductIdSchema };