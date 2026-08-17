import pool from "../config/db.js";

// ==========================================
// SUBMIT QUIZ
// ==========================================

export const submitQuiz = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            quiz_id,
            answers,
            time_taken,
        } = req.body;

        // ------------------------------------------
        // VALIDATE INPUT
        // ------------------------------------------

        if (!quiz_id || !answers) {
            return res.status(400).json({
                message:
                    "Quiz and answers are required",
            });
        }

        // ------------------------------------------
        // GET QUIZ SETTINGS
        // ------------------------------------------

        const quizResult = await pool.query(
            `
            SELECT
                id,
                title,
                duration,
                passing_percentage,
                maximum_attempts
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

        const quiz = quizResult.rows[0];

        const passingPercentage =
            Number(
                quiz.passing_percentage ?? 50
            );

        const maximumAttempts =
            Number(
                quiz.maximum_attempts ?? 1
            );

        // ------------------------------------------
        // CHECK PREVIOUS ATTEMPTS
        // ------------------------------------------

        const attemptsCountResult =
            await pool.query(
                `
                SELECT COUNT(*) AS count
                FROM attempts
                WHERE user_id = $1
                AND quiz_id = $2
                `,
                [
                    userId,
                    quiz_id,
                ]
            );

        const attemptsUsed =
            Number(
                attemptsCountResult.rows[0].count
            );

        // ------------------------------------------
        // MAXIMUM ATTEMPTS CHECK
        // ------------------------------------------

        if (
            attemptsUsed >=
            maximumAttempts
        ) {
            return res.status(403).json({
                message:
                    `Maximum attempts reached. You have used all ${maximumAttempts} attempt${maximumAttempts === 1 ? "" : "s"} for this quiz.`,

                attempts_used:
                    attemptsUsed,

                maximum_attempts:
                    maximumAttempts,
            });
        }

        // ------------------------------------------
        // GET QUESTIONS
        // ------------------------------------------

        const questionsResult =
            await pool.query(
                `
                SELECT *
                FROM questions
                WHERE quiz_id = $1
                ORDER BY id
                `,
                [quiz_id]
            );

        const questions =
            questionsResult.rows;

        if (questions.length === 0) {
            return res.status(404).json({
                message:
                    "No questions found for this quiz",
            });
        }

        // ------------------------------------------
        // CALCULATE RESULT
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

        const totalQuestions =
            questions.length;

        const score =
            correctAnswers;

        const percentage =
            totalQuestions > 0
                ? Number(
                      (
                          (correctAnswers /
                              totalQuestions) *
                          100
                      ).toFixed(2)
                  )
                : 0;

        // ------------------------------------------
        // PASS / FAIL
        // ------------------------------------------

        const passed =
            percentage >=
            passingPercentage;

        // ------------------------------------------
        // ATTEMPT NUMBER
        // ------------------------------------------

        const attemptNumber =
            attemptsUsed + 1;

        // ------------------------------------------
        // CREATE ATTEMPT
        // ------------------------------------------

        const attemptResult =
            await pool.query(
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

        const attempt =
            attemptResult.rows[0];

        // ------------------------------------------
        // SAVE INDIVIDUAL ANSWERS
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
        // RESPONSE
        // ------------------------------------------

        res.status(201).json({
            message:
                "Quiz submitted successfully",

            attempt: {
                ...attempt,

                attempt_number:
                    attemptNumber,

                attempts_used:
                    attemptNumber,

                maximum_attempts:
                    maximumAttempts,

                passing_percentage:
                    passingPercentage,

                passed,
            },
        });

    } catch (error) {
        console.error(
            "Submit quiz error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to submit quiz",
        });
    }
};


// ==========================================
// GET QUIZ ATTEMPT STATUS
// ==========================================

export const getQuizAttemptStatus = async (
    req,
    res
) => {
    try {
        const userId = req.user.id;

        const { quizId } =
            req.params;

        // ------------------------------------------
        // GET QUIZ SETTINGS
        // ------------------------------------------

        const quizResult = await pool.query(
            `
            SELECT
                id,
                title,
                maximum_attempts,
                passing_percentage
            FROM quizzes
            WHERE id = $1
            `,
            [quizId]
        );

        if (quizResult.rows.length === 0) {
            return res.status(404).json({
                message:
                    "Quiz not found",
            });
        }

        const quiz =
            quizResult.rows[0];

        const maximumAttempts =
            Number(
                quiz.maximum_attempts ?? 1
            );

        const passingPercentage =
            Number(
                quiz.passing_percentage ?? 50
            );

        // ------------------------------------------
        // COUNT USER ATTEMPTS
        // ------------------------------------------

        const attemptsResult =
            await pool.query(
                `
                SELECT COUNT(*) AS count
                FROM attempts
                WHERE user_id = $1
                AND quiz_id = $2
                `,
                [
                    userId,
                    quizId,
                ]
            );

        const attemptsUsed =
            Number(
                attemptsResult.rows[0].count
            );

        // ------------------------------------------
        // CALCULATE REMAINING
        // ------------------------------------------

        const remainingAttempts =
            Math.max(
                maximumAttempts -
                    attemptsUsed,
                0
            );

        const canAttempt =
            attemptsUsed <
            maximumAttempts;

        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(200).json({
            quiz_id:
                Number(quizId),

            quiz_title:
                quiz.title,

            attempts_used:
                attemptsUsed,

            maximum_attempts:
                maximumAttempts,

            remaining_attempts:
                remainingAttempts,

            passing_percentage:
                passingPercentage,

            can_attempt:
                canAttempt,
        });

    } catch (error) {
        console.error(
            "Get quiz attempt status error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to check quiz attempts",
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
        const { id } =
            req.params;

        const userId =
            req.user.id;

        // ------------------------------------------
        // GET ATTEMPT + QUIZ SETTINGS
        // ------------------------------------------

        const result = await pool.query(
            `
            SELECT
                attempts.*,
                quizzes.title AS quiz_title,
                quizzes.passing_percentage,
                quizzes.maximum_attempts,
                quizzes.duration AS quiz_duration

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
                message:
                    "Attempt not found",
            });
        }

        const attempt =
            result.rows[0];

        // ------------------------------------------
        // PASS / FAIL
        // ------------------------------------------

        const passingPercentage =
            Number(
                attempt.passing_percentage ??
                    50
            );

        const maximumAttempts =
            Number(
                attempt.maximum_attempts ??
                    1
            );

        const percentage =
            Number(
                attempt.percentage || 0
            );

        const passed =
            percentage >=
            passingPercentage;

        // ------------------------------------------
        // GET ATTEMPT NUMBER
        // ------------------------------------------

        const attemptNumberResult =
            await pool.query(
                `
                SELECT COUNT(*) AS attempt_number
                FROM attempts
                WHERE user_id = $1
                AND quiz_id = $2
                AND id <= $3
                `,
                [
                    userId,
                    attempt.quiz_id,
                    id,
                ]
            );

        const attemptNumber =
            Number(
                attemptNumberResult.rows[0]
                    .attempt_number
            );

        // ------------------------------------------
        // GET ANSWERS
        // ------------------------------------------

        const answersResult =
            await pool.query(
                `
                SELECT
                    answers.question_id,
                    answers.selected_answer,
                    answers.is_correct,
                    questions.question_text,
                    questions.correct_answer,
                    questions.explanation,
                    questions.difficulty

                FROM answers

                JOIN questions
                    ON answers.question_id =
                       questions.id

                WHERE answers.attempt_id = $1

                ORDER BY answers.question_id
                `,
                [id]
            );

        // ------------------------------------------
        // RESPONSE
        // ------------------------------------------

        res.status(200).json({
            ...attempt,

            attempt_number:
                attemptNumber,

            passing_percentage:
                passingPercentage,

            maximum_attempts:
                maximumAttempts,

            passed,

            answers:
                answersResult.rows,
        });

    } catch (error) {
        console.error(
            "Get attempt error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch result",
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

        res.status(200).json(
            result.rows
        );

    } catch (error) {
        console.error(
            "Leaderboard error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch leaderboard",
        });
    }
};