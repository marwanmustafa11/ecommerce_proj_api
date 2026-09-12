
import Joi from "joi";

const searchProductsSchema = Joi.object({
  search: Joi.string(),
  category: Joi.string(),
  subcategory: Joi.string(),
  brand: Joi.string(),
  tags: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  });

  export{
    searchProductsSchema
  }