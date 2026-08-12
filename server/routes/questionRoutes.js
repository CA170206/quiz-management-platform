import express from "express";
import {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByQuiz
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/", createQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);
router.get("/quiz/:quizId", getQuestionsByQuiz);
export default router;