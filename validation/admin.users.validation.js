import Joi from "joi";

export const updateRoleSchema = Joi.object({
    role: Joi.string()
        .valid("customer", "admin")
        .required()
        .messages({
            "any.only": "Invalid role",
            "any.required": "Role is required"
        }),
        id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.empty": "User ID cannot be empty",
            "string.pattern.base": "Invalid User ID",
            "any.required": "User ID is required"
        })

}).unknown(false);
export const userIdSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            "string.empty": "User ID cannot be empty",
            "string.pattern.base": "Invalid User ID",
            "any.required": "User ID is required"
        })
});