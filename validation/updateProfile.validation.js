import Joi from "joi";

const updateProfileSchema = Joi.object({
    username: Joi.string().required().messages({
        "any.required": "Username is required",
        "string.empty": "Username cannot be empty"
    }),
    phone: Joi.string(),
    avatar: Joi.string()
});

export {
    updateProfileSchema
};