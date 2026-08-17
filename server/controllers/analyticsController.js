import pool from "../config/db.js";


// ==========================================
// STUDENT ANALYTICS
// ==========================================

export const getStudentAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

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


// ==========================================
// ADMIN ANALYTICS
// ==========================================

export const getAdminAnalytics = async (
    req,
    res
) => {
    try {

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message:
                    "Admin access required",
            });
        }


        // ==========================================
        // PLATFORM STATISTICS
        // ==========================================

        const statsResult = await pool.query(
            `
            SELECT

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE role = 'student'
                )::integer AS total_students,

                (
                    SELECT COUNT(*)
                    FROM users
                )::integer AS total_users,

                (
                    SELECT COUNT(*)
                    FROM quizzes
                )::integer AS total_quizzes,

                (
                    SELECT COUNT(*)
                    FROM quizzes
                    WHERE status = 'published'
                )::integer AS published_quizzes,

                (
                    SELECT COUNT(*)
                    FROM quizzes
                    WHERE status = 'draft'
                )::integer AS draft_quizzes,

                (
                    SELECT COUNT(*)
                    FROM questions
                )::integer AS total_questions,

                (
                    SELECT COUNT(*)
                    FROM categories
                )::integer AS total_categories,

                (
                    SELECT COUNT(*)
                    FROM attempts
                )::integer AS total_attempts,

                COALESCE(
                    (
                        SELECT ROUND(
                            AVG(percentage),
                            2
                        )
                        FROM attempts
                    ),
                    0
                ) AS average_score,

                (
                    SELECT COUNT(*)
                    FROM attempts a
                    INNER JOIN quizzes q
                        ON q.id = a.quiz_id
                    WHERE a.percentage >= q.passing_percentage
                )::integer AS passed_attempts,

                (
                    SELECT COUNT(*)
                    FROM attempts a
                    INNER JOIN quizzes q
                        ON q.id = a.quiz_id
                    WHERE a.percentage < q.passing_percentage
                )::integer AS failed_attempts,

                COALESCE(
                    (
                        SELECT ROUND(
                            (
                                COUNT(*) FILTER (
                                    WHERE a.percentage >= q.passing_percentage
                                )::numeric
                                /
                                NULLIF(COUNT(*), 0)
                            ) * 100,
                            2
                        )
                        FROM attempts a
                        INNER JOIN quizzes q
                            ON q.id = a.quiz_id
                    ),
                    0
                ) AS pass_rate
            `
        );


        // ==========================================
        // POPULAR QUIZZES
        // ==========================================

        const popularQuizzesResult =
            await pool.query(
                `
                SELECT
                    q.id,
                    q.title,

                    COUNT(a.id)::integer
                        AS attempts,

                    COALESCE(
                        ROUND(
                            AVG(a.percentage),
                            2
                        ),
                        0
                    ) AS average_score

                FROM quizzes q

                LEFT JOIN attempts a
                    ON a.quiz_id = q.id

                GROUP BY
                    q.id,
                    q.title

                ORDER BY
                    attempts DESC,
                    average_score DESC

                LIMIT 5
                `
            );


        // ==========================================
        // RECENT ATTEMPTS
        // ==========================================

        const recentAttemptsResult =
            await pool.query(
                `
                SELECT
                    a.id,
                    u.full_name,
                    u.email,
                    q.title AS quiz_title,
                    a.score,
                    a.percentage,
                    a.submitted_at

                FROM attempts a

                INNER JOIN users u
                    ON u.id = a.user_id

                INNER JOIN quizzes q
                    ON q.id = a.quiz_id

                ORDER BY
                    a.submitted_at DESC

                LIMIT 10
                `
            );


        // ==========================================
        // CATEGORY ANALYTICS
        // ==========================================

        const categoriesResult =
            await pool.query(
                `
                SELECT
                    c.id,
                    c.name,

                    COUNT(DISTINCT q.id)::integer
                        AS quizzes,

                    COUNT(a.id)::integer
                        AS attempts

                FROM categories c

                LEFT JOIN quizzes q
                    ON q.category_id = c.id

                LEFT JOIN attempts a
                    ON a.quiz_id = q.id

                GROUP BY
                    c.id,
                    c.name

                ORDER BY
                    attempts DESC,
                    c.name ASC
                `
            );


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({
            stats: statsResult.rows[0],

            popularQuizzes:
                popularQuizzesResult.rows,

            recentAttempts:
                recentAttemptsResult.rows,

            categories:
                categoriesResult.rows,
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


// ==========================================
// DEVELOPER ANALYTICS
// ==========================================

export const getDeveloperAnalytics = async (
    req,
    res
) => {
    try {

        // ------------------------------------------
        // Developer access check
        // ------------------------------------------

        if (req.user.role !== "developer") {
            return res.status(403).json({
                message:
                    "Developer access required",
            });
        }


        // ------------------------------------------
        // Platform statistics
        // ------------------------------------------

        const statsResult = await pool.query(
            `
            SELECT

                (
                    SELECT COUNT(*)
                    FROM users
                )::integer AS total_users,

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE role = 'student'
                )::integer AS total_students,

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE role = 'admin'
                )::integer AS total_admins,

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE role = 'developer'
                )::integer AS total_developers,

                (
                    SELECT COUNT(*)
                    FROM quizzes
                )::integer AS total_quizzes,

                (
                    SELECT COUNT(*)
                    FROM questions
                )::integer AS total_questions,

                (
                    SELECT COUNT(*)
                    FROM categories
                )::integer AS total_categories,

                (
                    SELECT COUNT(*)
                    FROM attempts
                )::integer AS total_attempts,

                COALESCE(
                    (
                        SELECT ROUND(
                            AVG(percentage),
                            2
                        )
                        FROM attempts
                    ),
                    0
                ) AS average_score,

                COALESCE(
                    (
                        SELECT ROUND(
                            (
                                COUNT(*) FILTER (
                                    WHERE percentage >= 40
                                )::numeric
                                /
                                NULLIF(COUNT(*), 0)
                            ) * 100,
                            2
                        )
                        FROM attempts
                    ),
                    0
                ) AS pass_rate
            `
        );


        // ------------------------------------------
        // User role distribution
        // ------------------------------------------

        const roleResult = await pool.query(
            `
            SELECT
                role,
                COUNT(*)::integer AS count
            FROM users
            GROUP BY role
            ORDER BY role
            `
        );


        // ------------------------------------------
        // Recent registrations
        // ------------------------------------------

        const recentUsersResult =
            await pool.query(
                `
                SELECT
                    id,
                    full_name,
                    email,
                    role,
                    created_at
                FROM users
                ORDER BY created_at DESC
                LIMIT 10
                `
            );


        // ------------------------------------------
        // Most attempted quizzes
        // ------------------------------------------

        const popularQuizzesResult =
            await pool.query(
                `
                SELECT
                    q.id,
                    q.title,
                    COUNT(a.id)::integer AS attempts,
                    COALESCE(
                        ROUND(
                            AVG(a.percentage),
                            2
                        ),
                        0
                    ) AS average_score
                FROM quizzes q
                LEFT JOIN attempts a
                    ON a.quiz_id = q.id
                GROUP BY
                    q.id,
                    q.title
                ORDER BY
                    attempts DESC,
                    average_score DESC
                LIMIT 10
                `
            );


        // ------------------------------------------
        // Recent activity
        // ------------------------------------------

        const recentAttemptsResult =
            await pool.query(
                `
                SELECT
                    a.id,
                    u.full_name,
                    u.email,
                    q.title AS quiz_title,
                    a.score,
                    a.percentage,
                    a.submitted_at
                FROM attempts a
                INNER JOIN users u
                    ON u.id = a.user_id
                INNER JOIN quizzes q
                    ON q.id = a.quiz_id
                ORDER BY
                    a.submitted_at DESC
                LIMIT 10
                `
            );


        // ------------------------------------------
        // Response
        // ------------------------------------------

        res.status(200).json({
            stats: statsResult.rows[0],
            roles: roleResult.rows,
            recentUsers: recentUsersResult.rows,
            popularQuizzes:
                popularQuizzesResult.rows,
            recentAttempts:
                recentAttemptsResult.rows,
        });

    } catch (error) {

        console.error(
            "Developer analytics error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch developer analytics",
        });
    }
};