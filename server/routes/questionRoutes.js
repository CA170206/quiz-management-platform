import express from "express";

import {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByQuiz,
} from "../controllers/questionController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==========================================
// VIEW QUESTIONS
// ==========================================

// Get all questions
router.get("/", getQuestions);

// Get questions belonging to a specific quiz
router.get("/quiz/:quizId", getQuestionsByQuiz);


// ==========================================
// ADMIN ONLY
// ==========================================

// Create question
router.post(
    "/",
    authMiddleware,
    adminOnly,
    createQuestion
);

// Update question
router.put(
    "/:id",
    authMiddleware,
    adminOnly,
    updateQuestion
);

// Delete question
router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    deleteQuestion
);


export default router;