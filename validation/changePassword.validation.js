import Joi from "joi";

const changePasswordSchema = Joi.object
({
    oldPassword:
        Joi.string()
        .required(),
    newPassword:
        Joi.string()
        .min(8)
        .required()
});

export{
    changePasswordSchema
};