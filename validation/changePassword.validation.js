import Joi from "joi";

const changePasswordSchema = Joi.object
({
    oldPassword:
        Joi.string()
        .required(),
   
    newPassword:
        Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters long",
            "string.pattern.base":
                "Password must include uppercase, lowercase, number, and special character",
            "any.required": "New password is required"
        })
});

export{
    changePasswordSchema
};