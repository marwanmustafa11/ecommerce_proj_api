import express from "express";
import { changePassword } from "../controllers/changePassword.controller.js";
import { validateChangePassword } from "../middleware/validate.js";

const router = express.Router();

router.put("/change-password", validateChangePassword, changePassword);

export default router;