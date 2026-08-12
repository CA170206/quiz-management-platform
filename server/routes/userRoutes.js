import express from "express";

import {
    getProfile,
    deleteAccount,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Get logged-in user's profile
router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// Permanently delete account
router.delete(
    "/profile",
    authMiddleware,
    deleteAccount
);


export default router;