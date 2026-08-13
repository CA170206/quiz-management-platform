import express from "express";

import {
    submitQuiz,
    getAttemptById,
    getLeaderboard,
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
// GET ATTEMPT
// ==========================================

router.get(
    "/:id",
    authMiddleware,
    getAttemptById
);


export default router;