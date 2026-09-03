import Joi from "joi";
import { sendForgotPasswordOtpSchema , verifyForgotPasswordOtpSchema } from "../validation/forgotPassword.validation.js";
const validateSendForgotPasswordOtp = (req, res, next) =>
{
    const { error } = sendForgotPasswordOtpSchema.validate(req.body);
    /*
    sendForgotPasswordOtpSchema.validate(req.body)
    دي بترجع object شكله ازاي
    {
        error: null,
        value: {email: "john@example.com"}
    }
    */
    if (error)
    {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }
    next();
}

const validateVerifyForgotPasswordOtp = (req, res, next) =>
{
    const { error } = verifyForgotPasswordOtpSchema.validate(req.body);
    if (error)
    {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    next();
}


export {
    validateSendForgotPasswordOtp,
    validateVerifyForgotPasswordOtp
};