import express from "express";

import {
    getAllUsers,
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

export default router;