import express from "express";
import { getProfile } from "../controllers/getProfile.controller.js";
import { protect } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get(
    "/me",
    protect,
    getProfile
);

export default router;