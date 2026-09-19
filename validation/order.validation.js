import Joi from "joi";


export const createOrderSchema = Joi.object({
    shippingAddress:Joi.object({
        fullName: Joi.string().required().messages({
            "string.empty": "fullName is required",
            "any.required": "fullName is required"
        }),
        phone: Joi.string().required().messages({
            "string.empty": "phone is required",
            "any.required": "phone is required"
        }),
        country: Joi.string().required().messages({
            "string.empty": "country is required",
            "any.required": "country is required"
        }),
        city: Joi.string().required().messages({
            "string.empty": "city is required",
            "any.required": "city is required"
        }),
        address: Joi.string().required().messages({
            "string.empty": "address is required",
            "any.required": "address is required"
        }),
        postalCode: Joi.string().required().messages({
            "string.empty": "postalCode is required",
            "any.required": "postalCode is required"
        }),
    }).required(),
    paymentMethod:Joi.string().valid('cash','stripe','paypal','paymob').default("cash"),
    customerNote:Joi.string().max(1000),

   
}).unknown(false);