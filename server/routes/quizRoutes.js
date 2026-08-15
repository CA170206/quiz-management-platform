import express from "express";

import {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
} from "../controllers/quizController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC / STUDENT ACCESS
// ==========================================

// Get all quizzes
router.get("/", getQuizzes);

// Publish / Unpublish quiz
router.patch(
    "/:id/publish",
    authMiddleware,
    adminOnly,
    publishQuiz
);

// Get single quiz
router.get("/:id", getQuizById);


// ==========================================
// ADMIN ONLY
// ==========================================

// Create quiz
router.post(
    "/",
    authMiddleware,
    adminOnly,
    createQuiz
);

// Update quiz
router.put(
    "/:id",
    authMiddleware,
    adminOnly,
    updateQuiz
);

// Delete quiz
router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    deleteQuiz
);

export default router;