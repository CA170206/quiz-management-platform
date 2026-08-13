import pool from "../config/db.js";


// ==========================================
// STUDENT ANALYTICS
// ==========================================

export const getStudentAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // ------------------------------------------
        // Overall statistics
        // ------------------------------------------

        const statsResult = await pool.query(
            `
            SELECT
                COUNT(*)::integer AS quizzes_attempted,

                COALESCE(
                    ROUND(AVG(percentage), 2),
                    0
                ) AS average_score,

                COALESCE(
                    MAX(percentage),
                    0
                ) AS best_score,

                COALESCE(
                    ROUND(
                        (
                            COUNT(*) FILTER (
                                WHERE percentage >= 40
                            )::numeric
                            / NULLIF(COUNT(*), 0)
                        ) * 100,
                        2
                    ),
                    0
                ) AS pass_rate,

                COALESCE(
                    SUM(correct_answers),
                    0
                )::integer AS correct_answers,

                COALESCE(
                    SUM(incorrect_answers),
                    0
                )::integer AS incorrect_answers,

                COALESCE(
                    SUM(unanswered),
                    0
                )::integer AS unanswered

            FROM attempts
            WHERE user_id = $1
            `,
            [userId]
        );


        // ------------------------------------------
        // Last 10 attempts
        // ------------------------------------------

        const attemptsResult = await pool.query(
            `
            SELECT
                a.id,
                a.quiz_id,
                q.title AS quiz_title,
                a.score,
                a.percentage,
                a.total_questions,
                a.correct_answers,
                a.incorrect_answers,
                a.unanswered,
                a.time_taken,
                a.submitted_at

            FROM attempts a

            INNER JOIN quizzes q
                ON q.id = a.quiz_id

            WHERE a.user_id = $1

            ORDER BY a.submitted_at DESC

            LIMIT 10
            `,
            [userId]
        );


        // ------------------------------------------
        // Send response
        // ------------------------------------------

        res.status(200).json({
            stats: statsResult.rows[0],
            attempts: attemptsResult.rows,
        });

    } catch (error) {
        console.error(
            "Student analytics error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch student analytics",
        });
    }
};