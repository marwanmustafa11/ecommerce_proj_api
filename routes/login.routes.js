import express from "express";
import { login } from "../controllers/login.controller.js";
import { updateUserRole } from "../controllers/admin.users.controllers.js";
import {protect} from "../middleware/auth.middleware.js"
import { adminOnly } from "../middleware/role.check.js";
import { 
    validateAdmin
} from "../middleware/validate.js";
const router = express.Router();

router.post("/login", login )
router.patch("/change-role",
    protect,
    adminOnly,
    validateAdmin,
    updateUserRole
)
export default router;