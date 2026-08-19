import express from "express";

import {
    getAdminAnalytics,
    getAdminUsers,
    getAdminUserById,
    updateAdminUserStatus,
    deleteAdminUser,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required",
        });
    }

    next();
};

// ==========================================
// ADMIN ANALYTICS
// ==========================================

router.get(
    "/analytics",
    authMiddleware,
    adminOnly,
    getAdminAnalytics
);

// ==========================================
// USER MANAGEMENT
// ==========================================

// Get all students
router.get(
    "/users",
    authMiddleware,
    adminOnly,
    getAdminUsers
);

// Get single student + attempt history
router.get(
    "/users/:id",
    authMiddleware,
    adminOnly,
    getAdminUserById
);

// Activate / deactivate student
router.patch(
    "/users/:id/status",
    authMiddleware,
    adminOnly,
    updateAdminUserStatus
);

// Delete student
router.delete(
    "/users/:id",
    authMiddleware,
    adminOnly,
    deleteAdminUser
);

export default router;