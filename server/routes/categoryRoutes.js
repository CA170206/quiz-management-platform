import express from "express";

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoryControllers.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// VIEW CATEGORIES
// ==========================================

// Get all categories
router.get("/", getCategories);


// ==========================================
// ADMIN ONLY
// ==========================================

// Create category
router.post(
    "/",
    authMiddleware,
    adminOnly,
    createCategory
);

// Update category
router.put(
    "/:id",
    authMiddleware,
    adminOnly,
    updateCategory
);

// Delete category
router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    deleteCategory
);


export default router;