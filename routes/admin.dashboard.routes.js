import express from "express";
import { getDashboard } from "../controllers/admin.dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";

const router = express.Router();

router.get("/", protect, adminOnly, getDashboard);

export default router;