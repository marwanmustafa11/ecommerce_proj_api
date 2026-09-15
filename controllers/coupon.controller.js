import Cart from "../models/Cart.model.js";
import { getCouponByCode } from "../utils/couponHelpers.js";

// POST /carts/coupon

export const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = getCouponByCode(code);
        if (!coupon) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired coupon code"
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found for the user"
            });
        }

        if (!cart.items || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot apply a coupon to an empty cart"
            });
        }

        cart.coupon = { ...coupon };

        await cart.save();

        return res.status(200).json({
            success: true,
            message: `Coupon applied successfully - you saved ${(
                cart.coupon.discountType === "percentage" ? 
                `${cart.coupon.discountValue}%` : 
                `$${cart.coupon.discountValue}`
            )}!`,
            itemCount: cart.itemCount,
            subtotal: cart.subtotal,
            discountAmount: cart.discountAmount,
            total: cart.total,
            coupon: cart.coupon?.code || null,
            items: cart.items,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}
/////////////////////////////////////////
// DELETE /carts/coupon

export const removeCoupon = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found for the user"
            });
        }

        cart.coupon = undefined;
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Coupon removed successfully",
            itemCount: cart.itemCount,
            subtotal: cart.subtotal,
            discountAmount: cart.discountAmount,
            total: cart.total,
            coupon: cart.coupon?.code || null,
            items: cart.items,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}
