import express from "express";

import {
    getAllUsers,
    getUserById,
} from "../controllers/developerController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireDeveloper from "../middleware/requireDeveloper.js";

const router = express.Router();

// ==========================================
// DEVELOPER PROTECTED ROUTES
// ==========================================

// Get all users
router.get(
    "/users",
    authMiddleware,
    requireDeveloper,
    getAllUsers
);

// Get single user
router.get(
    "/users/:id",
    authMiddleware,
    requireDeveloper,
    getUserById
);

export default router;