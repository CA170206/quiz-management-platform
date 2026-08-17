import pool from "../config/db.js";

export const getAdminAnalytics = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM users) AS users,
                (SELECT COUNT(*) FROM quizzes) AS quizzes,
                (SELECT COUNT(*) FROM questions) AS questions,
                (SELECT COUNT(*) FROM attempts) AS attempts
        `);

        const stats = result.rows[0];

        res.status(200).json({
            users: Number(stats.users),
            quizzes: Number(stats.quizzes),
            questions: Number(stats.questions),
            attempts: Number(stats.attempts),
        });

    } catch (error) {
        console.error(
            "Admin analytics error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch admin analytics",
        });
    }
};