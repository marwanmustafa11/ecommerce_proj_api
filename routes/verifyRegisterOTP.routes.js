import express from "express"
import verifyRegisterOtp from "../controllers/verifyRegisterOtp.controllers.js";
import { validateVerifyOtp } from "../middleware/validate.js";
const router=express.Router()
router.post("/register/verify-otp",
    validateVerifyOtp,
    verifyRegisterOtp
)
export default router;
