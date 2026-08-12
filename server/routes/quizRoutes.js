import express from "express";
import {
    getQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/", getQuizzes);
router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);
router.get("/:id", getQuizById);

export default router;