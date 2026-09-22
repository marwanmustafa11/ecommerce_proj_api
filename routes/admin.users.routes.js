import express from "express";
import { 
    getAllUsers,
    getOneUser,
    deleteUser,
    addUser,
    getAllCarts,
    getAllWishlists,
    getTopWishlistedProducts
} from "../controllers/admin.users.controllers.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.check.js";
import { validateUserId } from "../middleware/validate.js";

const router = express.Router();

router.get("/all", protect, adminOnly, getAllUsers);

router.get("/carts", protect, adminOnly, getAllCarts);
router.get("/wishlists/top-products", protect, adminOnly, getTopWishlistedProducts);
router.get("/wishlists", protect, adminOnly, getAllWishlists);

router.get("/:id", protect, adminOnly, validateUserId, getOneUser);
router.delete("/:id", protect, adminOnly, validateUserId, deleteUser);
router.post("/add", protect, adminOnly, addUser);

export default router;