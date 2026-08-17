import pool from "../config/db.js";

export const getAdminAnalytics = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Admin access required",
            });
        }

        const statsResult = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM users)
                    AS total_students,

                (SELECT COUNT(*) FROM quizzes)
                    AS total_quizzes,

                (SELECT COUNT(*)
                 FROM quizzes
                 WHERE status = 'published')
                    AS published_quizzes,

                (SELECT COUNT(*)
                 FROM quizzes
                 WHERE status = 'draft')
                    AS draft_quizzes,

                (SELECT COUNT(*) FROM questions)
                    AS total_questions,

                (SELECT COUNT(*) FROM attempts)
                    AS total_attempts,

                COALESCE(
                    (SELECT ROUND(AVG(percentage), 2)
                     FROM attempts),
                    0
                ) AS average_score,

                (
                    SELECT COUNT(*)
                    FROM attempts a
                    JOIN quizzes q
                        ON q.id = a.quiz_id
                    WHERE a.percentage >= q.passing_percentage
                ) AS passed_attempts,

                (
                    SELECT COUNT(*)
                    FROM attempts a
                    JOIN quizzes q
                        ON q.id = a.quiz_id
                    WHERE a.percentage < q.passing_percentage
                ) AS failed_attempts
        `);

        const popularQuizzes = await pool.query(`
            SELECT
                q.id,
                q.title,
                COUNT(a.id)::integer AS attempts,
                COALESCE(
                    ROUND(AVG(a.percentage), 2),
                    0
                ) AS average_score
            FROM quizzes q
            LEFT JOIN attempts a
                ON a.quiz_id = q.id
            GROUP BY q.id, q.title
            ORDER BY attempts DESC
            LIMIT 5
        `);

        const categories = await pool.query(`
            SELECT
                c.id,
                c.name,
                COUNT(DISTINCT q.id)::integer AS quizzes,
                COUNT(a.id)::integer AS attempts
            FROM categories c
            LEFT JOIN quizzes q
                ON q.category_id = c.id
            LEFT JOIN attempts a
                ON a.quiz_id = q.id
            GROUP BY c.id, c.name
            ORDER BY attempts DESC
            LIMIT 5
        `);

        const recentAttempts = await pool.query(`
    SELECT
        a.id,
        u.full_name,
        q.title AS quiz_title,
        a.score,
        a.percentage,
        a.submitted_at
    FROM attempts a
    JOIN users u ON u.id = a.user_id
    JOIN quizzes q ON q.id = a.quiz_id
    ORDER BY a.submitted_at DESC
    LIMIT 10
`);

const attemptsOverTime = await pool.query(`
    SELECT
        DATE(submitted_at) AS date,
        COUNT(*)::integer AS attempts
    FROM attempts
    GROUP BY DATE(submitted_at)
    ORDER BY date DESC
    LIMIT 7
`);

        res.status(200).json({
            stats: statsResult.rows[0],
            popularQuizzes: popularQuizzes.rows,
            categories: categories.rows,
            recentAttempts: recentAttempts.rows,
            attemptsOverTime: attemptsOverTime.rows,
        });

    } catch (error) {
        console.error(
            "Admin analytics error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch admin analytics",
        });
    }
};