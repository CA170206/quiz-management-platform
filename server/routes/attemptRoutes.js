import express from "express";

import {
    submitQuiz,
    getAttemptById,
    getLeaderboard,
    getQuizAttemptStatus,
} from "../controllers/attemptController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// SUBMIT QUIZ
// ==========================================

router.post(
    "/",
    authMiddleware,
    submitQuiz
);


// ==========================================
// LEADERBOARD
// IMPORTANT: before /:id
// ==========================================

router.get(
    "/leaderboard",
    authMiddleware,
    getLeaderboard
);


// ==========================================
// QUIZ ATTEMPT STATUS
// IMPORTANT: before /:id
// ==========================================

router.get(
    "/quiz/:quizId/status",
    authMiddleware,
    getQuizAttemptStatus
);


// ==========================================
// GET ATTEMPT
// ==========================================

router.get(
    "/:id",
    authMiddleware,
    getAttemptById
);


export default router;