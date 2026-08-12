import pool from "../config/db.js";

export const getQuizzes = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM quizzes"
    );

    res.json(result.rows);
};
export const createQuiz = async (req, res) => {

    const {
        category_id,
        title,
        description,
        duration
    } = req.body;

    if (!category_id || !title || !duration) {
        return res.status(400).json({
            message: "Category, title and duration are required"
        });
    }

    const result = await pool.query(
        `INSERT INTO quizzes
        (category_id, title, description, duration)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
            category_id,
            title,
            description,
            duration
        ]
    );

    res.status(201).json({
        message: "Quiz created successfully",
        quiz: result.rows[0]
    });
};


export const updateQuiz = async (req, res) => {

    const { id } = req.params;

    const {
        category_id,
        title,
        description,
        duration
    } = req.body;

    if (!category_id || !title || !duration) {
        return res.status(400).json({
            message: "Category, title and duration are required"
        });
    }

    const result = await pool.query(
        `UPDATE quizzes
         SET category_id = $1,
             title = $2,
             description = $3,
             duration = $4
         WHERE id = $5
         RETURNING *`,
        [
            category_id,
            title,
            description,
            duration,
            id
        ]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Quiz not found"
        });
    }

    res.status(200).json({
        message: "Quiz updated successfully",
        quiz: result.rows[0]
    });
};

export const deleteQuiz = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM quizzes WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Quiz not found"
        });
    }

    res.status(200).json({
        message: "Quiz deleted successfully",
        quiz: result.rows[0]
    });
};