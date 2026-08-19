import express from "express";

import {
    getAdminAnalytics,
    getAdminUsers,
    getAdminUserById,
    updateAdminUserStatus,
    deleteAdminUser,
    getAdminAttempts,
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

router.get(
    "/users",
    authMiddleware,
    adminOnly,
    getAdminUsers
);

router.get(
    "/users/:id",
    authMiddleware,
    adminOnly,
    getAdminUserById
);

router.patch(
    "/users/:id/status",
    authMiddleware,
    adminOnly,
    updateAdminUserStatus
);

router.delete(
    "/users/:id",
    authMiddleware,
    adminOnly,
    deleteAdminUser
);

// ==========================================
// ADMIN ATTEMPTS / RESULTS
// ==========================================

router.get(
    "/attempts",
    authMiddleware,
    adminOnly,
    getAdminAttempts
);

export default router;