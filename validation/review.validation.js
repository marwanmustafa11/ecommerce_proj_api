import Joi from "joi";

export const addReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required().messages({
    "number.min": "Rating must be at least 1",
    "number.max": "Rating cannot exceed 5",
    "any.required": "Rating is required",
  }),

  comment: Joi.string().trim().min(3).max(500).required().messages({
    "string.empty": "Comment is required",
    "string.min": "Comment must be at least 3 characters long",
  }),
});

export const reviewParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.length": "Invalid Product ID format",
  }),

  rid: Joi.string().hex().length(24).messages({
    "string.length": "Invalid Review ID format",
  }),
});