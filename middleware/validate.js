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
import { wishlistProductIdSchema } from "../validation/wishlist.validation.js";
import {
    updateRoleSchema,
    userIdSchema
} from "../validation/admin.users.validation.js";
import {
  createOrderSchema,
  orderIdSchema,
  updateOrderStatusSchema,
} from "../validation/order.validation.js";

export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation errors in data",
        errors: error.details.map((detail) => detail.message),
      });
    }

    next();
  };
};

export const validateRegister = validate(registerSchema);
export const validateCart = validate(cartSchema);
export const validateCreateOrder = validate(createOrderSchema);
export const validateVerifyOtp = validate(verifyOtpSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateCoupon = validate(applyCouponSchema);
export const validateAdmin = validate(updateRoleSchema);
export const validateUpdateOrderStatus = validate(updateOrderStatusSchema);
export const validateSendForgotPasswordOtp = validate(sendForgotPasswordOtpSchema);
export const validateVerifyForgotPasswordOtp = validate(verifyForgotPasswordOtpSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateProductId = validate(productIdSchema, "params");
export const validateWishlistProductId = validate(wishlistProductIdSchema,"params");
export const validateOrderId = validate(orderIdSchema, "params");
export const validateUserId = validate(userIdSchema, "params");
export const validateSearchProducts = validate(searchProductsSchema,"query");