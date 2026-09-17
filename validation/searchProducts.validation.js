import Joi from "joi";

const searchProductsSchema = Joi.object({
  search: Joi.string().optional(),
  category: Joi.string().optional(),
  subcategory: Joi.string().optional(),
  brand: Joi.string().optional(),
  tags: Joi.string().optional(),

  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  rating: Joi.number().min(0).max(5).optional(),

  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  sort: Joi.string().valid(
    "price_asc",
    "price_desc",
    "rating",
    "newest"
  ).optional()

});

export { searchProductsSchema };
