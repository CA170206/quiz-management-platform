import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import userRoutes from "./routes/userRoutes.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

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