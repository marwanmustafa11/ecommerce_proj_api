import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty"
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required"
  }),
password: Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must include uppercase, lowercase, number, and special character",
    "any.required": "Password is required"
  }),
  phone: Joi.string().optional()

});
export const verifyOtpSchema=Joi.object({
    email:Joi.string().email().required().messages({
          "string.email": "Please enter a valid email address",
            "any.required":"Email is required"
    }),
    otp:Joi.string().pattern(/^\d{6}$/).required().messages({
            "string.pattern.base": "Otp must be 6 digits",
            "any.required":"Otp required"
    })
});

