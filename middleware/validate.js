import {
  sendForgotPasswordOtpSchema,
  verifyForgotPasswordOtpSchema,
} from "../validation/forgotPassword.validation.js";

import {
  verifyOtpSchema,
  registerSchema,
} from "../validation/register.validation.js";

import { cartSchema, productIdSchema } from "../validation/cart.validations.js";

import { applyCouponSchema } from "../validation/coupon.validation.js";

import { changePasswordSchema } from"../validation/changePassword.validation.js";

import { updateProfileSchema } from "../validation/updateProfile.validation.js";
import { searchProductsSchema } from "../validation/searchProducts.validation.js";
//validation for wishlist
import { wishlistProductIdSchema } from "../validation/wishlist.validation.js";

import {
    updateRoleSchema,
    userIdSchema
} from "../validation/admin.users.validation.js";
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
      errors: errorMessages,
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
  const { error } = cartSchema.validate(req.body, { abortEarly: false });

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
const validateChangePassword = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body, {
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

const validateUpdateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body, {
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

const validateCoupon = (req, res, next) => {
  const { error } = applyCouponSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errorMessages,
    });
  }

  next();
};
// const validateProductId = (req, res, next) => {
//   const { error } = productIdSchema.validate(req.params, { abortEarly: false });

//   if (error) {
//     const errorMessages = error.details.map((detail) => detail.message);

//     return res.status(400).json({
//       success: false,
//       message: "Validation errors in data",
//       errors: errorMessages,
//     });
//   }

//   next();
// };



const validateProductId = (req, res, next) => {
  const { error } = productIdSchema.validate(req.params, {
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

// const validateProductId= (req, res, next) => {
//     const { error } = productIdSchema.validate(
//         req.params,
//         { abortEarly: false }
const validateSearchProducts = (req, res, next) => {
  const { error } = searchProductsSchema.validate(req.query, {
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


//validation for wishlist
const validateWishlistProductId = (req, res, next) => {
  const { error } = wishlistProductIdSchema.validate(req.params, {
    abortEarly: false,
  });

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


const validateAdmin = (req, res, next) => {
  const { error } = updateRoleSchema.validate(req.body, {
    abortEarly: false,
  });

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
const validateUserId = (req, res, next) => {

    const { error } = userIdSchema.validate(req.params);

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid User ID"
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
  validateChangePassword,
  validateUpdateProfile,
  validateProductId,
  validateProduct,
  validateWishlistProductId,
  validateSearchProducts,
  validateCoupon,
  validateAdmin,
  validateUserId
};

