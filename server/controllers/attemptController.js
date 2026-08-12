import pool from "../config/db.js";

export const submitQuiz = async (req, res) => {
    try {
        const { user_id, quiz_id, answers, time_taken } = req.body;

        if (!user_id || !quiz_id || !answers) {
            return res.status(400).json({
                message: "User, quiz and answers are required"
            });
        }

        const questionsResult = await pool.query(
            `SELECT *
             FROM questions
             WHERE category_id = (
                 SELECT category_id
                 FROM quizzes
                 WHERE id = $1
             )
             ORDER BY id`,
            [quiz_id]
        );

        const questions = questionsResult.rows;

        if (questions.length === 0) {
            return res.status(404).json({
                message: "No questions found for this quiz"
            });
        }

        let correctAnswers = 0;
        let incorrectAnswers = 0;
        let unanswered = 0;

        questions.forEach((question) => {
            const selectedAnswer = answers[question.id];

            if (!selectedAnswer) {
                unanswered++;
            } else if (
                selectedAnswer === question.correct_answer
            ) {
                correctAnswers++;
            } else {
                incorrectAnswers++;
            }
        });

        const totalQuestions = questions.length;
        const score = correctAnswers;
        const percentage =
            (correctAnswers / totalQuestions) * 100;

        const result = await pool.query(
            `INSERT INTO attempts
            (
                user_id,
                quiz_id,
                score,
                percentage,
                total_questions,
                correct_answers,
                incorrect_answers,
                unanswered,
                time_taken
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
            [
                user_id,
                quiz_id,
                score,
                percentage,
                totalQuestions,
                correctAnswers,
                incorrectAnswers,
                unanswered,
                time_taken || 0
            ]
        );

        res.status(201).json({
            message: "Quiz submitted successfully",
            attempt: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to submit quiz"
        });
    }
};

export const getAttemptById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                attempts.*,
                quizzes.title AS quiz_title
             FROM attempts
             JOIN quizzes
             ON attempts.quiz_id = quizzes.id
             WHERE attempts.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Attempt not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch result"
        });
    }
};