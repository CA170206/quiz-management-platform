import express from "express";
import { 
    getQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/", getQuizzes);
router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

export default router;