import express from "express"
import verifyOtp from "../controllers/verifOtp.controllers.js";
import { validateVerifyOtp } from "../middleware/validate.js";
const router=express.Router()
router.post("/register/verify-otp",
    validateVerifyOtp,
    verifyOtp
)
export default router;
