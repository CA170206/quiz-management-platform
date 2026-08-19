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

// ==========================================
// GET ALL STUDENTS
// ADMIN USER MANAGEMENT
// ==========================================

export const getAdminUsers = async (req, res) => {
    try {
        const search = req.query.search || "";

        const result = await pool.query(
    `
    SELECT
        id,
        full_name,
        email,
        role,
        active,
        created_at
    FROM users
    WHERE role = 'student'
    AND (
        full_name ILIKE $1
        OR email ILIKE $1
    )
    ORDER BY id DESC
    `,
    [`%${search}%`]
);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(
            "Get admin users error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch students",
        });
    }
};


// ==========================================
// GET SINGLE STUDENT
// + ATTEMPT HISTORY
// ==========================================

export const getAdminUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const userResult = await pool.query(
            `
            SELECT
                id,
                full_name,
                email,
                role,
                created_at
            FROM users
            WHERE id = $1
            AND role = 'student'
            `,
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        const attemptsResult = await pool.query(
            `
            SELECT
    attempts.id,
    attempts.quiz_id,
    quizzes.title AS quiz_title,
    attempts.score,
    attempts.percentage,
    attempts.total_questions,
    attempts.correct_answers,
    attempts.incorrect_answers,
    attempts.unanswered,
    attempts.time_taken
FROM attempts
JOIN quizzes
    ON attempts.quiz_id = quizzes.id
WHERE attempts.user_id = $1
ORDER BY attempts.id DESC
`,
[id]);

        res.status(200).json({
            user: userResult.rows[0],
            attempts: attemptsResult.rows,
        });
    } catch (error) {
        console.error(
            "Get admin user error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch student",
        });
    }
};


// ==========================================
// ACTIVATE / DEACTIVATE STUDENT
// ==========================================

export const updateAdminUserStatus = async (
    req,
    res
) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        if (typeof active !== "boolean") {
            return res.status(400).json({
                message:
                    "Active status must be true or false",
            });
        }

        // Your current users table has no active column.
        // Add it once using:
        //
        // ALTER TABLE users
        // ADD COLUMN active BOOLEAN DEFAULT TRUE;

        const result = await pool.query(
            `
            UPDATE users
            SET active = $1
            WHERE id = $2
            AND role = 'student'
            RETURNING
                id,
                full_name,
                email,
                role,
                active,
                created_at
            `,
            [active, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            message: active
                ? "Student activated successfully"
                : "Student deactivated successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Update user status error:",
            error
        );

        res.status(500).json({
            message: "Failed to update student status",
        });
    }
};


// ==========================================
// DELETE STUDENT
// ==========================================

export const deleteAdminUser = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query("BEGIN");

        const userResult = await client.query(
            `
            SELECT id, role
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        if (userResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Student not found",
            });
        }

        if (userResult.rows[0].role !== "student") {
            await client.query("ROLLBACK");

            return res.status(403).json({
                message:
                    "Only student accounts can be deleted",
            });
        }

        // Delete saved answers first
        await client.query(
            `
            DELETE FROM answers
            WHERE attempt_id IN (
                SELECT id
                FROM attempts
                WHERE user_id = $1
            )
            `,
            [id]
        );

        // Delete attempts
        await client.query(
            `
            DELETE FROM attempts
            WHERE user_id = $1
            `,
            [id]
        );

        // Delete student
        const result = await client.query(
            `
            DELETE FROM users
            WHERE id = $1
            AND role = 'student'
            RETURNING id, full_name, email
            `,
            [id]
        );

        await client.query("COMMIT");

        res.status(200).json({
            message: "Student deleted successfully",
            user: result.rows[0],
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error(
            "Delete student error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete student",
        });
    } finally {
        client.release();
    }
};

// ==========================================
// GET ALL QUIZ ATTEMPTS
// ADMIN RESULTS
// ==========================================

export const getAdminAttempts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                a.id,
                u.full_name,
                u.email,
                q.title AS quiz_title,
                a.score,
                a.percentage,
                a.total_questions,
                a.correct_answers,
                a.incorrect_answers,
                a.unanswered,
                a.time_taken,
                a.submitted_at,
                q.passing_percentage,

                CASE
                    WHEN a.percentage >= q.passing_percentage
                    THEN true
                    ELSE false
                END AS passed

            FROM attempts a

            JOIN users u
                ON u.id = a.user_id

            JOIN quizzes q
                ON q.id = a.quiz_id

            ORDER BY a.submitted_at DESC
        `);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(
            "Get admin attempts error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch attempts",
        });
    }
};