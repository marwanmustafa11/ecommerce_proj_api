import express from "express";
import { logout } from "../controllers/logout.controller.js"
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/logout", protect, logout);

export default router;