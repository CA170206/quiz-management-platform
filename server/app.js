import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import attemptRoutes from "./routes/attemptRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import developerRoutes from "./routes/developerRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";


const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/attempts", attemptRoutes);

app.use("/api/users", userRoutes);

app.use("/api/analytics", analyticsRoutes);


// ==========================================
// ROOT
// ==========================================

app.get("/", (req, res) => {
    res.json({
        message:
            "Quiz Management Backend Running 🚀",
    });
});


// ==========================================
// TEST PROTECTED ROUTE
// ==========================================

app.get(
    "/api/test",
    authMiddleware,
    (req, res) => {
        res.json({
            message:
                "Protected Route Accessed",
            user: req.user,
        });
    }
);

// developer routes
app.use(
    "/api/developer",
    developerRoutes
);

export default app;