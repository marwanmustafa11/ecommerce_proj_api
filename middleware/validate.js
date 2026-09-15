import {
    sendForgotPasswordOtpSchema,
    verifyForgotPasswordOtpSchema
} from "../validation/forgotPassword.validation.js";

import {
    verifyOtpSchema, 
    registerSchema
} from "../validation/register.validation.js";

import { changePasswordSchema } from"../validation/changePassword.validation.js";
import { updateProfileSchema } from "../validation/updateProfile.validation.js";
import { productQuerySchema } from "../validation/sortingPagination.validation.js";

const validateSendForgotPasswordOtp = (req, res, next) => {
    const { error } = sendForgotPasswordOtpSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

const validateVerifyForgotPasswordOtp = (req, res, next) => {
    const { error } = verifyForgotPasswordOtpSchema.validate(
        req.body,
        { abortEarly: false }
    );

    if (error) {
        const errorMessages = error.details.map(
            (detail) => detail.message
        );

        return res.status(400).json({
            success: false,
            message: errorMessages
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
    const { error } = verifyOtpSchema.validate(
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
        });
    }

    next();
};

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

const validateSortingPagination = (req, res, next) => {
    const { error } = productQuerySchema.validate(req.query, {
        abortEarly: false
    });

    if (error) {
        const errorMessages = error.details.map(
            (detail) => detail.message
        );

        return res.status(400).json({
            success: false,
            message: errorMessages
        });
    }

    next();
};

export {
    validateSendForgotPasswordOtp,
    validateVerifyForgotPasswordOtp,
    validateRegister,
    validateVerifyOtp,
    validateChangePassword,
    validateUpdateProfile,
    validateSortingPagination
};
