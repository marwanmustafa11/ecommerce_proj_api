import Joi from "joi";

const sendForgotPasswordOtpSchema = Joi.object
({
    email:
        Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),
});

const verifyForgotPasswordOtpSchema = Joi.object({

    email:
        Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email address",
            "any.required": "Email is required"
        }),

    otp:
        Joi.string()
        .length(6)
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            "string.length": "OTP must be 6 digits",
            "string.pattern.base": "OTP must contain numbers only",
            "any.required": "OTP is required"
        }),

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

export {
    sendForgotPasswordOtpSchema ,
    verifyForgotPasswordOtpSchema
};
