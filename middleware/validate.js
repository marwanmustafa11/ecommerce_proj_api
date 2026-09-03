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
        
const validateRegister = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: "fail",
        message: "خطأ في البيانات المدخلة",
        errors: errorMessages
      });
    }

    next();
  };
};


export {
    validateSendForgotPasswordOtp,
    validateVerifyForgotPasswordOtp,
    validateRegister
};