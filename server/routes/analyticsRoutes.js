import express from "express";

import {
    getStudentAnalytics,
    getAdminAnalytics,
    getDeveloperAnalytics,
} from "../controllers/analyticsController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import requireDeveloper from "../middleware/requireDeveloper.js";

const router = express.Router();


// ==========================================
// STUDENT ANALYTICS
// ==========================================

router.get(
    "/student",
    authMiddleware,
    getStudentAnalytics
);


// ==========================================
// ADMIN ANALYTICS
// ==========================================

router.get(
    "/admin",
    authMiddleware,
    getAdminAnalytics
);


// ==========================================
// DEVELOPER ANALYTICS
// ==========================================

router.get(
    "/developer",
    authMiddleware,
    requireDeveloper,
    getDeveloperAnalytics
);


export default router;