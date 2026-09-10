import express from "express";
import { updateProfile } from "../controllers/updateProfile.controller.js";
import { validateUpdateProfile } from "../middleware/validate.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.patch(
    "/:id",
    protect,
    validateUpdateProfile,
    updateProfile
);

export default router;