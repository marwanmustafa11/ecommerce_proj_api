import {
  sendForgotPasswordOtpSchema,
  verifyForgotPasswordOtpSchema,
} from "../validation/forgotPassword.validation.js";

import {
  verifyOtpSchema,
  registerSchema,
} from "../validation/register.validation.js";

import{
    cartSchema,
    productIdSchema
} from "../validation/cart.validations.js"


import { changePasswordSchema } from"../validation/changePassword.validation.js";
import { updateProfileSchema } from "../validation/updateProfile.validation.js";
const validateSendForgotPasswordOtp = (req, res, next) => {
  const { error } = sendForgotPasswordOtpSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

const validateVerifyForgotPasswordOtp = (req, res, next) => {
  const { error } = verifyForgotPasswordOtpSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);

    return res.status(400).json({
      success: false,
      message: errorMessages,
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
        success: false,
        message: "Validation errors in data",
        errors: errorMessages
    });
    }

    next();
    };

const validateVerifyOtp = (req, res, next) => {
  const { error } = verifyOtpSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);

    return res.status(400).json({
      success: false,
      message: "Validation errors in data",
      errors: errorMessages,
    });
  }

  next();
};
const validateProduct = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    next();
  };
};


const validateCart = (req, res, next) => {
    const { error } = cartSchema.validate(
        req.body,
        { abortEarly: false }
    );

    if (error) {
        const errorMessages = error.details.map(
            (detail) => detail.message
        );

        return res.status(400).json({
            success: false,
            message: "Validation errors in data",
            errors: errorMessages
    })
    }
    next();
}
const validateChangePassword = (req,res,next) =>{
    const{error} = changePasswordSchema.validate(
        req.body,
        { abortEarly: false}
    );

    if(error) {
        const errorMessages = error.details.map(
            (detail) => detail.message
        ); 

        return res.status(400).json({
            success:false,
            message:errorMessages
        });
    }
    next();
};

const validateUpdateProfile = (req, res, next) => {
    const { error } = updateProfileSchema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);

        return res.status(400).json({
            success: false,
            message: errorMessages

        });
    }

    next();
};

const validateProductId= (req, res, next) => {
    const { error } = productIdSchema.validate(
        req.params,
        { abortEarly: false }
    );

    if (error) {
        const errorMessages = error.details.map(
            (detail) => detail.message
        );

        return res.status(400).json({
            success: false,
            message: "Validation errors in data",
            errors: errorMessages
        });
    }

    next();
};



export {
    validateSendForgotPasswordOtp,
    validateVerifyForgotPasswordOtp,
    validateRegister,
    validateVerifyOtp,
    validateCart,
    validateProductId,
    validateChangePassword,
    validateUpdateProfile,
    validateProduct
};
