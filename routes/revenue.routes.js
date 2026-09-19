import express from "express";
import { getRevenue } from "../controllers/revenue.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";

const router = express.Router();

router.get("/revenue", protect, adminOnly, getRevenue);

export default router;