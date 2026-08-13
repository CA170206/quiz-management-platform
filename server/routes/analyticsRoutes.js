import express from "express";

import {
    getStudentAnalytics,
    getAdminAnalytics,
} from "../controllers/analyticsController.js";

import authMiddleware from "../middleware/authMiddleware.js";

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


export default router;