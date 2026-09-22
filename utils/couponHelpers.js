import { COUPONS } from "../config/coupon.js";

 

export const getCouponByCode = (code) => {
    if (!code) return null;

    const normalizedCode = code.trim().toUpperCase();
    return COUPONS[normalizedCode] || null;
};
 
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
 
export const isCouponValid = (code) => {
    return getCouponByCode(code) !== null;
}
