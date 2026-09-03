import Joi from "joi";

const sendForgotPasswordOtpSchema = Joi.object
({
    /* 
    عايز اعمل سكيما لبيانات من النوع اوبجكت و دا فعلا علشان
    {
    "email": "john@example.com"
    }
    */
    email: 
        Joi.string()
        .email()
        .required()
});

const verifyForgotPasswordOtpSchema = Joi.object
({
    email:
        Joi.string()
        .email()
        .required() ,

    otp: 
        Joi.string()
        .length(6)
        .required() ,

    newPassword:
        Joi.string()
        .min(8)
        .required()
});

export {
    sendForgotPasswordOtpSchema ,
    verifyForgotPasswordOtpSchema
};
