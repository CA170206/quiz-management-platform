import express from "express";

import {
    getProfile,
    updateProfile,
    deleteAccount,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// USER PROFILE
// ==========================================

// Get profile
router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// Update profile
router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// Delete account
router.delete(
    "/profile",
    authMiddleware,
    deleteAccount
);


export default router;