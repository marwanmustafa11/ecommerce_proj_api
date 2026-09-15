import Joi from "joi";

const productQuerySchema = Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1),
    sort: Joi.string().valid(
        "price_asc",
        "price_desc",
        "rating",
        "newest"
    )
});

export {
    productQuerySchema
};