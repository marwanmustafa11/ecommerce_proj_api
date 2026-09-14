import express from "express";
import { applyCoupon , removeCoupon } from "../controllers/coupon.controller.js";
import { validateRegister } from "../middleware/validate.js";
import { applyCouponSchema } from "../validation/coupon.validation.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/coupon", 
    protect, 
    validateRegister(applyCouponSchema), 
    applyCoupon
);
router.delete("/coupon", protect, removeCoupon);

export default router;