import pool from "../config/db.js";

// ==========================================
// GET ALL QUESTIONS
// ==========================================

export const getQuestions = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT
                questions.*,
                quizzes.title AS quiz_title,
                categories.name AS category_name
            FROM questions
            JOIN quizzes
                ON questions.quiz_id = quizzes.id
            JOIN categories
                ON questions.category_id = categories.id
            ORDER BY questions.id
            `
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Get questions error:", error);

        res.status(500).json({
            message: "Failed to fetch questions",
        });
    }
};


// ==========================================
// CREATE QUESTION
// ==========================================

export const createQuestion = async (req, res) => {
    try {
        const {
            quiz_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
        } = req.body;

        if (
            !quiz_id ||
            !question_text ||
            !option_a ||
            !option_b ||
            !option_c ||
            !option_d ||
            !correct_answer
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Get category from selected quiz
        const quizResult = await pool.query(
            `
            SELECT id, category_id
            FROM quizzes
            WHERE id = $1
            `,
            [quiz_id]
        );

        if (quizResult.rows.length === 0) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        const categoryId =
            quizResult.rows[0].category_id;

        // Make sure correct answer is one of the options
        const options = [
            option_a,
            option_b,
            option_c,
            option_d,
        ];

        if (!options.includes(correct_answer)) {
            return res.status(400).json({
                message:
                    "Correct answer must match one of the options",
            });
        }

        const result = await pool.query(
            `
            INSERT INTO questions
            (
                category_id,
                quiz_id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [
                categoryId,
                quiz_id,
                question_text.trim(),
                option_a.trim(),
                option_b.trim(),
                option_c.trim(),
                option_d.trim(),
                correct_answer.trim(),
            ]
        );

        res.status(201).json({
            message: "Question created successfully",
            question: result.rows[0],
        });
    } catch (error) {
        console.error("Create question error:", error);

        res.status(500).json({
            message: "Failed to create question",
        });
    }
};


// ==========================================
// UPDATE QUESTION
// ==========================================

export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            quiz_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
        } = req.body;

        if (
            !quiz_id ||
            !question_text ||
            !option_a ||
            !option_b ||
            !option_c ||
            !option_d ||
            !correct_answer
        ) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check quiz
        const quizResult = await pool.query(
            `
            SELECT id, category_id
            FROM quizzes
            WHERE id = $1
            `,
            [quiz_id]
        );

        if (quizResult.rows.length === 0) {
            return res.status(404).json({
                message: "Quiz not found",
            });
        }

        const categoryId =
            quizResult.rows[0].category_id;

        // Validate correct answer
        const options = [
            option_a,
            option_b,
            option_c,
            option_d,
        ];

        if (!options.includes(correct_answer)) {
            return res.status(400).json({
                message:
                    "Correct answer must match one of the options",
            });
        }

        const result = await pool.query(
            `
            UPDATE questions
            SET
                category_id = $1,
                quiz_id = $2,
                question_text = $3,
                option_a = $4,
                option_b = $5,
                option_c = $6,
                option_d = $7,
                correct_answer = $8
            WHERE id = $9
            RETURNING *
            `,
            [
                categoryId,
                quiz_id,
                question_text.trim(),
                option_a.trim(),
                option_b.trim(),
                option_c.trim(),
                option_d.trim(),
                correct_answer.trim(),
                id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        res.status(200).json({
            message: "Question updated successfully",
            question: result.rows[0],
        });
    } catch (error) {
        console.error("Update question error:", error);

        res.status(500).json({
            message: "Failed to update question",
        });
    }
};


// ==========================================
// DELETE QUESTION
// ==========================================

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM questions
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Question not found",
            });
        }

        res.status(200).json({
            message: "Question deleted successfully",
            question: result.rows[0],
        });
    } catch (error) {
        console.error("Delete question error:", error);

        res.status(500).json({
            message: "Failed to delete question",
        });
    }
};


// ==========================================
// GET QUESTIONS BY QUIZ
// ==========================================

export const getQuestionsByQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        const result = await pool.query(
            `
            SELECT
                questions.*
            FROM questions
            WHERE questions.quiz_id = $1
            ORDER BY questions.id
            `,
            [quizId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(
            "Get questions by quiz error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch quiz questions",
        });
    }
};