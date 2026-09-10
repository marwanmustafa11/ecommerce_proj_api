import express from "express";
import { changePassword } from "../controllers/changePassword.controller.js";
import { validateChangePassword } from "../middleware/validate.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put(
    "/change-password",
    protect,
    validateChangePassword,
    changePassword
);

export default router;