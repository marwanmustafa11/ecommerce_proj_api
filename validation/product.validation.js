import Joi from "joi";

const createProductValidation = Joi.object({
  name: Joi.string().trim().max(200).required(),
  shortDescription: Joi.string().trim().max(500).required(),
  description: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(0).required(),
  sku: Joi.string().trim().optional(),
  category: Joi.string().required(),
  subcategory: Joi.string().optional(),
  brand: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  featured: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

const updateProductValidation = Joi.object({
  name: Joi.string().trim().max(200).optional(),
  shortDescription: Joi.string().trim().max(500).optional(),
  description: Joi.string().trim().optional(),
  price: Joi.number().min(0).optional(),
  discountPrice: Joi.number().min(0).optional(),
  stock: Joi.number().integer().min(0).optional(),
  sku: Joi.string().trim().optional(),
  category: Joi.string().optional(),
  subcategory: Joi.string().optional(),
  brand: Joi.string().trim().optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  featured: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  deletedImagePublicIds: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional()
});

export { createProductValidation, updateProductValidation };
