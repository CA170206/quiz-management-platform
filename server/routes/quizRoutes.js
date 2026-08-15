import express from "express";

import {
    getQuizzes,
    getAllQuizzesForAdmin,
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
// STUDENT ACCESS
// ==========================================

// Get published quizzes only
router.get("/", getQuizzes);


// ==========================================
// ADMIN ACCESS
// ==========================================

// Get all quizzes
// Includes draft, published and unpublished
router.get(
    "/admin",
    authMiddleware,
    adminOnly,
    getAllQuizzesForAdmin
);


// Publish / Unpublish quiz
router.patch(
    "/:id/publish",
    authMiddleware,
    adminOnly,
    publishQuiz
);


// Get single quiz
router.get("/:id", getQuizById);


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