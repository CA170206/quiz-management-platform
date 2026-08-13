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

router.get("/", getQuestions);

router.get(
    "/quiz/:quizId",
    getQuestionsByQuiz
);

// ==========================================
// ADMIN ONLY
// ==========================================

router.post(
    "/",
    authMiddleware,
    adminOnly,
    createQuestion
);

router.put(
    "/:id",
    authMiddleware,
    adminOnly,
    updateQuestion
);

router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    deleteQuestion
);

export default router;