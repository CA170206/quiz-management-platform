import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quizzes", quizRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Quiz Management Backend Running 🚀"
    });
});

app.get("/api/test", authMiddleware, (req, res) => {
    res.json({
        message: "Protected Route Accessed",
        user: req.user
    });
});

export default app;