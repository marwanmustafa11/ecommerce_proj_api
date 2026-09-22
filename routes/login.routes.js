import express from "express";
import { login } from "../controllers/login.controller.js";
import { updateUserRole } from "../controllers/admin.users.controllers.js";
import {protect} from "../middleware/auth.middleware.js"
import { adminOnly } from "../middleware/role.check.js";
import { 
    validateAdmin
} from "../middleware/validate.js";
import { adminTest } from "../controllers/admin.users.controllers.js";
const router = express.Router();

router.post("/login", login )
router.patch("/change-role",
    protect,
    adminOnly,
    validateAdmin,
    updateUserRole
)
router.get("/admin-test",
    protect,
    adminOnly,
    adminTest
)
export default router;