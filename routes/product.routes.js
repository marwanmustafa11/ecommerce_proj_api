import express from "express";
import { searchProducts } from "../controllers/product.controller.js";
import { validateSearchProducts } from "../middleware/validate.js";

 const router = express.Router();

router.get("/search", validateSearchProducts, searchProducts);

export default router;

 product.routes.js    