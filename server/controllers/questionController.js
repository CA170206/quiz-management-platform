import pool from "../config/db.js";

export const getQuestions = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM questions"
    );

    res.json(result.rows);
};

export const createQuestion = async (req, res) => {

    const {
        category_id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
    } = req.body;

    if (
        !category_id ||
        !question_text ||
        !option_a ||
        !option_b ||
        !option_c ||
        !option_d ||
        !correct_answer
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const result = await pool.query(
        `INSERT INTO questions
        (category_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            category_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer
        ]
    );

    res.status(201).json({
        message: "Question created successfully",
        question: result.rows[0]
    });
};

export const updateQuestion = async (req, res) => {

    const { id } = req.params;

    const {
        category_id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer
    } = req.body;

    if (
        !category_id ||
        !question_text ||
        !option_a ||
        !option_b ||
        !option_c ||
        !option_d ||
        !correct_answer
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const result = await pool.query(
        `UPDATE questions
         SET category_id = $1,
             question_text = $2,
             option_a = $3,
             option_b = $4,
             option_c = $5,
             option_d = $6,
             correct_answer = $7
         WHERE id = $8
         RETURNING *`,
        [
            category_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            id
        ]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Question not found"
        });
    }

    res.status(200).json({
        message: "Question updated successfully",
        question: result.rows[0]
    });
};

export const deleteQuestion = async (req, res) => {

    const { id } = req.params;

    const result = await pool.query(
        "DELETE FROM questions WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Question not found"
        });
    }

    res.status(200).json({
        message: "Question deleted successfully",
        question: result.rows[0]
    });
};