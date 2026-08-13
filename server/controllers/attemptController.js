import pool from "../config/db.js";

// ==========================================
// SUBMIT QUIZ
// ==========================================

export const submitQuiz = async (req, res) => {
    try {
        // Get user ID from JWT
        const userId = req.user.id;

        const {
            quiz_id,
            answers,
            time_taken,
        } = req.body;

        // ------------------------------------------
        // Validate input
        // ------------------------------------------

        if (!quiz_id || !answers) {
            return res.status(400).json({
                message: "Quiz and answers are required",
            });
        }

        // ------------------------------------------
        // Get questions for THIS QUIZ
        // ------------------------------------------

        const questionsResult = await pool.query(
            `
            SELECT *
            FROM questions
            WHERE quiz_id = $1
            ORDER BY id
            `,
            [quiz_id]
        );

        const questions = questionsResult.rows;

        if (questions.length === 0) {
            return res.status(404).json({
                message: "No questions found for this quiz",
            });
        }

        // ------------------------------------------
        // Calculate result
        // ------------------------------------------

        let correctAnswers = 0;
        let incorrectAnswers = 0;
        let unanswered = 0;

        questions.forEach((question) => {
            const selectedAnswer =
                answers[question.id];

            if (!selectedAnswer) {
                unanswered++;
            } else if (
                selectedAnswer ===
                question.correct_answer
            ) {
                correctAnswers++;
            } else {
                incorrectAnswers++;
            }
        });

        const totalQuestions = questions.length;

        const score = correctAnswers;

        const percentage =
            totalQuestions > 0
                ? (
                      (correctAnswers /
                          totalQuestions) *
                      100
                  ).toFixed(2)
                : 0;

        // ------------------------------------------
        // Create attempt
        // ------------------------------------------

        const attemptResult = await pool.query(
            `
            INSERT INTO attempts
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
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            )
            RETURNING *
            `,
            [
                userId,
                quiz_id,
                score,
                percentage,
                totalQuestions,
                correctAnswers,
                incorrectAnswers,
                unanswered,
                time_taken || 0,
            ]
        );

        const attempt = attemptResult.rows[0];

        // ------------------------------------------
        // Save individual answers
        // ------------------------------------------

        for (const question of questions) {
            const selectedAnswer =
                answers[question.id] || null;

            const isCorrect =
                selectedAnswer !== null &&
                selectedAnswer ===
                    question.correct_answer;

            await pool.query(
                `
                INSERT INTO answers
                (
                    attempt_id,
                    question_id,
                    selected_answer,
                    is_correct
                )
                VALUES ($1, $2, $3, $4)
                `,
                [
                    attempt.id,
                    question.id,
                    selectedAnswer,
                    isCorrect,
                ]
            );
        }

        // ------------------------------------------
        // Response
        // ------------------------------------------

        res.status(201).json({
            message: "Quiz submitted successfully",
            attempt,
        });

    } catch (error) {
        console.error(
            "Submit quiz error:",
            error
        );

        res.status(500).json({
            message: "Failed to submit quiz",
        });
    }
};


// ==========================================
// GET ATTEMPT BY ID
// ==========================================

export const getAttemptById = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        const userId = req.user.id;

        // ------------------------------------------
        // Get attempt
        // ------------------------------------------

        const result = await pool.query(
            `
            SELECT
                attempts.*,
                quizzes.title AS quiz_title

            FROM attempts

            JOIN quizzes
                ON attempts.quiz_id =
                   quizzes.id

            WHERE attempts.id = $1
            AND attempts.user_id = $2
            `,
            [
                id,
                userId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Attempt not found",
            });
        }

        const attempt = result.rows[0];

        // ------------------------------------------
        // Get answers
        // ------------------------------------------

        const answersResult = await pool.query(
            `
            SELECT
                answers.question_id,
                answers.selected_answer,
                answers.is_correct,
                questions.question_text,
                questions.correct_answer

            FROM answers

            JOIN questions
                ON answers.question_id =
                   questions.id

            WHERE answers.attempt_id = $1

            ORDER BY answers.question_id
            `,
            [id]
        );

        res.status(200).json({
            ...attempt,
            answers: answersResult.rows,
        });

    } catch (error) {
        console.error(
            "Get attempt error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch result",
        });
    }
};


// ==========================================
// LEADERBOARD
// ==========================================

export const getLeaderboard = async (
    req,
    res
) => {
    try {
        const result = await pool.query(
            `
            SELECT
                users.id AS user_id,
                users.full_name,

                MAX(attempts.score)
                    AS best_score,

                MAX(attempts.percentage)
                    AS best_percentage,

                COUNT(attempts.id)
                    AS attempts

            FROM attempts

            JOIN users
                ON attempts.user_id =
                   users.id

            GROUP BY
                users.id,
                users.full_name

            ORDER BY
                best_percentage DESC,
                best_score DESC
            `
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(
            "Leaderboard error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch leaderboard",
        });
    }
};