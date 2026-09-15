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
});

export { searchProductsSchema };
