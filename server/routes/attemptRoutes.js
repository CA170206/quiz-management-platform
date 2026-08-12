import express from "express";

import {
    submitQuiz,
    getAttemptById,
    getLeaderboard
} from "../controllers/attemptController.js";

const router = express.Router();

router.post("/", submitQuiz);

// IMPORTANT: leaderboard must come BEFORE /:id
router.get("/leaderboard", getLeaderboard);

router.get("/:id", getAttemptById);

export default router;