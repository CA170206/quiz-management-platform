import pool from "../config/db.js";

// ==========================================
// GET ALL PUBLISHED QUIZZES
// STUDENT ACCESS
// ==========================================

export const getQuizzes = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM quizzes
             WHERE status = 'published'
             ORDER BY id DESC`
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Get quizzes error:", error);

        res.status(500).json({
            message: "Failed to fetch quizzes",
        });
    }
};


// ==========================================
// GET ALL QUIZZES
// ADMIN ACCESS
// ==========================================

export const getAllQuizzesForAdmin = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM quizzes
             ORDER BY id DESC`
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(
            "Get all quizzes for admin error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch quizzes",
        });
    }
};


// ==========================================
// CREATE QUIZ
// ==========================================

export const createQuiz = async (req, res) => {
    try {
        const {
            category_id,
            title,
            description,
            duration,
            status,
        } = req.body;

        if (!category_id || !title || !duration) {
            return res.status(400).json({
                message:
                    "Category, title and duration are required",
            });
        }

        const validStatuses = [
            "draft",
            "published",
            "unpublished",
        ];

        const quizStatus = status || "draft";

        if (!validStatuses.includes(quizStatus)) {
            return res.status(400).json({
                message: "Invalid quiz status",
            });
        }

        const result = await pool.query(
            `INSERT INTO quizzes
                (
                    category_id,
                    title,
                    description,
                    duration,
                    status
                )
             VALUES
                ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                category_id,
                title,
                description,
                duration,
                quizStatus,
            ]
        );

        res.status(201).json({
            message: "Quiz created successfully",
            quiz: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Create quiz error:",
            error
        );

        res.status(500).json({
            message: "Failed to create quiz",
        });
    }
};


// ==========================================
// UPDATE QUIZ
// ==========================================

export const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category_id,
            title,
            description,
            duration,
            status,
        } = req.body;

        if (!category_id || !title || !duration) {
            return res.status(400).json({
                message:
                    "Category, title and duration are required",
            });
        }

        if (
            status &&
            ![
                "draft",
                "published",
                "unpublished",
            ].includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid quiz status",
            });
        }

        const result = await pool.query(
            `UPDATE quizzes
             SET category_id = $1,
                 title = $2,
                 description = $3,
                 duration = $4,
                 status = COALESCE($5, status)
             WHERE id = $6
             RETURNING *`,
            [
                category_id,
                title,
                description,
                duration,
                status || null,
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        res.status(200).json({
            message: "Quiz updated successfully",
            quiz: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Update quiz error:",
            error
        );

        res.status(500).json({
            message: "Failed to update quiz",
        });
    }
};


// ==========================================
// PUBLISH / UNPUBLISH QUIZ
// ==========================================

export const publishQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const existingQuiz = await pool.query(
            `SELECT id, status
             FROM quizzes
             WHERE id = $1`,
            [id]
        );

        if (existingQuiz.rows.length === 0) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        const currentStatus =
            existingQuiz.rows[0].status;

        const newStatus =
            currentStatus === "published"
                ? "unpublished"
                : "published";

        const result = await pool.query(
            `UPDATE quizzes
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [
                newStatus,
                id,
            ]
        );

        res.status(200).json({
            message:
                newStatus === "published"
                    ? "Quiz published successfully"
                    : "Quiz unpublished successfully",
            quiz: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Publish quiz error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update quiz status",
        });
    }
};


// ==========================================
// DELETE QUIZ
// ==========================================

export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM quizzes
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        res.status(200).json({
            message: "Quiz deleted successfully",
            quiz: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Delete quiz error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete quiz",
        });
    }
};


// ==========================================
// GET SINGLE QUIZ
// ==========================================

export const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM quizzes
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(
            "Get quiz by ID error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch quiz",
        });
    }
};


// ==========================================
// GET QUESTIONS BY QUIZ
// ==========================================

export const getQuestionsByQuiz = async (
    req,
    res
) => {
    try {
        const { quizId } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM questions
             WHERE quiz_id = $1
             ORDER BY id`,
            [quizId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(
            "Get questions by quiz error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch quiz questions",
        });
    }
};