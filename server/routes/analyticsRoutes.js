import express from "express";

import {
    getStudentAnalytics,
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


export default router;