import { COUPONS } from "../config/coupon.js";

// getCouponByCode

export const getCouponByCode = (code) => {
    if (!code) return null;

    const normalizedCode = code.trim().toUpperCase();
    return COUPONS[normalizedCode] || null;
};

// calculateDiscountAmount => we can delete it if we will use the virtuals in the cart model instead of this function

export const calculateDiscountAmount = (subtotal, coupon) => {
    if(!coupon || !coupon.code) return 0;

    if (subtotal <= 0) return 0;

    let discount = 0;

    if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
        discount = coupon.discountValue;
    }

    return Math.min(discount , subtotal);
};
////////////////////////////////////////////////////
// isCouponValid

export const isCouponValid = (code) => {
    return getCouponByCode(code) !== null;
}
