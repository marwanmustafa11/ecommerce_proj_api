import express from "express";
import { getProducts } from "../controllers/sortingPagination.controller.js";
import { validateSortingPagination } from "../middleware/validate.js";

const router = express.Router();

router.get(
    "/products",
    validateSortingPagination,
    getProducts
);

export default router;