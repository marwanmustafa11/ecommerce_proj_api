import express from "express";
const router = express.Router();

import { validateSendForgotPasswordOtp , validateVerifyForgotPasswordOtp } from "../middleware/validate.js";

import { sendForgotPasswordOtp , verifyForgotPasswordOtp } from "../controllers/forgotPassword.controller.js";

router.post("/forgot-password/send-otp", validateSendForgotPasswordOtp,
    sendForgotPasswordOtp
);

router.post(
    "/forgot-password/verify-otp", validateVerifyForgotPasswordOtp,
    verifyForgotPasswordOtp
);

export default router;