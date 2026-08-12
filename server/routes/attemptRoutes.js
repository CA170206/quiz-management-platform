import express from "express";

import {
    submitQuiz,
    getAttemptById
} from "../controllers/attemptController.js";

const router = express.Router();

router.post("/", submitQuiz);
router.get("/:id", getAttemptById);

export default router;