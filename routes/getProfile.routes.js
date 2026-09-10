import express from "express";
import { getProfile } from "../controllers/getProfile.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";


const router = express.Router();

router.get(
    "/me",
    protect,
    adminOnly,
    getProfile
);

export default router;