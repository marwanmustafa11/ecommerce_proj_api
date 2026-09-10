import Joi from "joi";

const updateProfileSchema = Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().email(),
    phone: Joi.string(),
    avatar: Joi.string()
});

export {
    updateProfileSchema
};