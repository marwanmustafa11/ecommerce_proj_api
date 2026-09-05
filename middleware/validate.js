import {
    sendForgotPasswordOtpSchema,
    verifyForgotPasswordOtpSchema
} from "../validation/forgotPassword.validation.js";

import { verifyOtpSchema } from "../validation/auth.validation.js";

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

const validateRegister = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(
            req.body,
            { abortEarly: false }
        );

        if (error) {
            const errorMessages = error.details.map(
                (detail) => detail.message
            );

            return res.status(400).json({
                status: "fail",
                message: "Validation errors in data",
                errors: errorMessages
            });
        }

        next();
    };
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
            status: "fail",
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
    validateVerifyOtp
};